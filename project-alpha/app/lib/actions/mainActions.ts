"use server";

import {
    BookmarksFormState,
    Bookmarks,
    PodcastFormSchema,
    PodcastFormState,
    addToBookmarkSchema,
} from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import {
    fetchCategories,
    fetchPodcast,
    fetchTags,
    getPodcastCategories,
    getPodcastTags,
    getUserBookmarkByPodcastId,
} from "../data";
import { v4 } from "uuid";
import path from "path";
import fs from "fs";
import { getSession } from "./session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const saveImage = async (image_url: string, podcastId: string, imageFile: File) => {
    const folderPath = path.join(process.cwd(), "public", "assets", "podcasts", podcastId);

    const avatarBuffer = await imageFile.arrayBuffer();

    !fs.existsSync(folderPath) && fs.mkdirSync(folderPath, { recursive: true });

    const newFilePath = path.join(folderPath, image_url);

    fs.writeFileSync(newFilePath, Buffer.from(avatarBuffer));
};

const overwriteImage = async (relative_file_path: string, imageFile: File) => {
    const avatarBuffer = await imageFile.arrayBuffer();

    const filePath = path.join(process.cwd(), "public", relative_file_path);

    fs.writeFileSync(filePath, Buffer.from(avatarBuffer));
};

const removePodcastFiles = async (folderPath: string) => {
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            throw err;
        }
    });
};

const CreatePodcast = PodcastFormSchema.omit({
    id: true,
    author_id: true,
    is_active: true,
    comments_enabled: true,
    access_token: true,
    status: true,
    created_at: true,
    updated_at: true,
});

const AddBookmarks = addToBookmarkSchema.omit({
    podcast_id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
});

export async function createPodcast(state: PodcastFormState, formData: FormData) {
    // validation of the form data
    const validatedFields = CreatePodcast.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        avatar: formData.get("avatar"),
        banner: formData.get("banner") === "" ? null : formData.get("banner"),
        age_rating: formData.get("age_rating"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Відсутні обов'язкові поля. Створення подкасту не вдалося.",
        };
    }

    const selectedCategories = JSON.parse(formData.get("categories") as string) || [];
    const selectedTags = JSON.parse(formData.get("tags") as string) || [];

    const [categories, tags] = await Promise.all([fetchCategories(), fetchTags()]);

    const selectedCategoriesId = categories
        .filter((category) => selectedCategories.includes(category.name))
        .map((category) => ({ category_id: category.id }));

    const selectedTagsId = tags.filter((tag) => selectedTags.includes(tag.name)).map((tag) => ({ tag_id: tag.id }));

    // Getting data from validated fields
    const { title, description, avatar, banner, age_rating } = validatedFields.data;

    // Processing the image data
    const avatar_url = `${v4()}.${avatar.name.split(".").pop()}`;
    const banner_url = banner ? `${v4()}.${banner.name.split(".").pop()}` : null;

    const session = await getSession();
    const userId = session?.userId;

    const result = await sql`
            INSERT INTO podcasts (title, description, avatar_url, banner_url,  age_rating, author_id)
            VALUES (${title}, ${description}, ${avatar_url}, ${banner_url}, ${age_rating}, ${userId})
            RETURNING id
            `;
    const podcast = result.rows[0];
    if (!podcast) {
        return {
            message: "Під час створення нового подкасту виникла помилка.",
        };
    }

    await saveImage(avatar_url, podcast.id, avatar);
    banner_url && (await saveImage(banner_url, podcast.id, banner));

    const categoriesJson = JSON.stringify(selectedCategoriesId);
    const tagsJson = JSON.stringify(selectedTagsId);

    await sql
        .query(
            `INSERT INTO podcastCategories (podcast_id, category_id)
                SELECT $1, category_id
                FROM json_populate_recordset(NULL::podcastCategories, $2::json)`,
            [podcast.id, categoriesJson]
        )
        .catch((err) => {
            console.log(err);
        });

    await sql
        .query(
            `INSERT INTO podcastTags (podcast_id, tag_id)
                SELECT $1, tag_id
                FROM json_populate_recordset(NULL::podcastTags, $2::json)`,
            [podcast.id, tagsJson]
        )
        .catch((err) => {
            console.log(err);
        });

    revalidatePath("/p/podcast/");

    redirect(`/p/podcast/${podcast.id}`);
}

async function updateManagement(id: string, data: { is_active?: boolean; comments_enabled?: boolean }) {
    const { is_active, comments_enabled } = data;

    const updated_at = new Date().toISOString().split("T")[0];

    await sql`
        UPDATE podcasts
        SET is_active = ${is_active}, comments_enabled = ${comments_enabled}, updated_at = ${updated_at}
        WHERE id = ${id}
    `;
}

export async function editPodcast(state: PodcastFormState, formData: FormData) {
    const action = formData.get("action") as string;
    const id = formData.get("id") as string;

    if (!id) {
        return { message: "Недійсний ідентифікатор подкасту." };
    }

    try {
        const podcast = await fetchPodcast(id);

        if (!podcast) {
            return { message: "Подкаст не знайдено." };
        }

        const updated_at = new Date().toISOString().split("T")[0];

        if (action === "update-main-data") {
            const dataToValidate: { [key: string]: any } = {};
            formData.forEach((value, key) => {
                dataToValidate[key] = value;
            });

            const UpdatePodcast = PodcastFormSchema.pick({ title: true, description: true, age_rating: true });

            const validatedFields = UpdatePodcast.safeParse(dataToValidate);

            if (!validatedFields.success) {
                return {
                    errors: validatedFields.error.flatten().fieldErrors,
                    message: "Validation error. Please check your input.",
                };
            }

            const { title, description, age_rating } = validatedFields.data;

            await sql`
                UPDATE podcasts
                SET title = ${title}, description = ${description}, age_rating = ${age_rating}, updated_at = ${updated_at}
                WHERE id = ${id}
            `;
        } else if (action === "update-media") {
            const dataToValidate: { [key: string]: any } = {};
            formData.forEach((value, key) => {
                dataToValidate[key] = value;
            });
            const UpdatePodcast = PodcastFormSchema.pick({ avatar: true, banner: true }).partial();

            const validatedFields = UpdatePodcast.safeParse(dataToValidate);

            if (!validatedFields.success) {
                return {
                    errors: validatedFields.error.flatten().fieldErrors,
                    message: "Validation error. Please check your input.",
                };
            }

            for (const [key, value] of Object.entries(validatedFields.data)) {
                console.log(key, value);
                if (key === "avatar") {
                    const filePath = `/assets/podcasts/${id}/${podcast.avatar_url}`;
                    await overwriteImage(filePath, value);
                    await sql`
                        UPDATE podcasts
                        SET updated_at = ${updated_at}
                        WHERE id = ${id}
                    `;
                } else if (key === "banner") {
                    const filePath = `/assets/podcasts/${id}/${podcast.banner_url}`;
                    await overwriteImage(filePath, value);
                    await sql`
                        UPDATE podcasts
                        SET updated_at = ${updated_at}
                        WHERE id = ${id}
                    `;
                }
            }
        } else if (action === "update-classification") {
            const [podcastCategories, podcastTags, categories, tags] = await Promise.all([
                getPodcastCategories(id),
                getPodcastTags(id),
                fetchCategories(),
                fetchTags(),
            ]);

            const selectedCategories = categories
                .filter((category) => JSON.parse(formData.get("categories") as string).includes(category.name))
                .map((category) => category.id);
            const currCategories = podcastCategories.map((category) => category.id);
            const categoriesToAdd = selectedCategories
                .filter((id) => !currCategories.includes(id))
                .map((category) => ({ category_id: category }));
            const categoriesToRemove = currCategories.filter((id) => !selectedCategories.includes(id));

            const selectedTags = tags
                .filter((tag) => JSON.parse(formData.get("tags") as string).includes(tag.name))
                .map((tag) => tag.id);
            const currTags = podcastTags.map((tag) => tag.id);
            const tagsToAdd = selectedTags.filter((id) => !currTags.includes(id)).map((tag) => ({ tag_id: tag }));
            const tagsToRemove = currTags.filter((id) => !selectedTags.includes(id));

            if (categoriesToAdd.length > 0) {
                await sql.query(
                    `INSERT INTO podcastCategories (podcast_id, category_id)
                    SELECT $1, category_id
                    FROM json_populate_recordset(NULL::podcastCategories, $2::json)`,
                    [id, JSON.stringify(categoriesToAdd)]
                );
            }
            if (categoriesToRemove.length > 0) {
                const placeholders = categoriesToRemove.map((_, index) => `$${index + 2}`).join(", ");

                await sql.query(
                    `DELETE FROM podcastCategories
                    WHERE podcast_id = $1
                    AND category_id IN (${placeholders})`,
                    [id, ...categoriesToRemove]
                );
            }
            if (tagsToAdd.length > 0) {
                await sql.query(
                    `INSERT INTO podcastTags (podcast_id, tag_id)
                    SELECT $1, tag_id
                    FROM json_populate_recordset(NULL::podcastTags, $2::json)`,
                    [id, JSON.stringify(tagsToAdd)]
                );
            }
            if (tagsToRemove.length > 0) {
                const placeholders = tagsToRemove.map((_, index) => `$${index + 2}`).join(", ");

                await sql.query(
                    `DELETE FROM podcastTags
                    WHERE podcast_id = $1
                    AND tag_id IN (${placeholders})`,
                    [id, ...tagsToRemove]
                );
            }
        } else if (action === "update-management") {
            const dataToValidate: { [key: string]: any } = {
                is_active: (formData.get("is_active") as string) === "true",
                comments_enabled: (formData.get("comments_enabled") as string) === "true",
                status: formData.get("status"),
            };

            const UpdatePodcast = PodcastFormSchema.pick({
                is_active: true,
                comments_enabled: true,
                status: true,
            }).partial();

            const validatedFields = UpdatePodcast.safeParse(dataToValidate);

            if (!validatedFields.success) {
                return {
                    errors: validatedFields.error.flatten().fieldErrors,
                    message: "Validation error. Please check your input.",
                };
            }

            const { is_active, comments_enabled, status } = validatedFields.data;

            await sql`
                UPDATE podcasts
                SET is_active = ${is_active}, comments_enabled = ${comments_enabled}, status = ${status}, updated_at = ${updated_at}
                WHERE id = ${id}
            `;
        } else {
            return { message: "Invalid action." };
        }
    } catch (error) {
        console.error("Error updating podcast:", error);
        return {
            message: "An error occurred while updating the podcast.",
            error: error,
        };
    }

    revalidatePath(`/p/podcast/${id}`);
    redirect(`/p/podcast/${id}`);
}

export async function addToBookmarks(options: {
    user_id: string;
    podcast_id: string;
    list_type: "listening" | "planned" | "abandoned" | "finished" | "favorite";
}) {
    const validatedFields = AddBookmarks.safeParse({
        list_type: options.list_type,
    });

    if (!validatedFields.success) {
        return {
            status: "error",
        };
    }

    const isBookmarked = await getUserBookmarkByPodcastId(options.podcast_id, options.user_id);

    const { list_type } = validatedFields.data;

    if (isBookmarked === list_type) {
        return {
            status: "success",
            data: list_type,
        };
    }

    const updated_at = new Date().toISOString().split("T")[0];
    try {
        if (isBookmarked) {
            await sql`
                UPDATE bookmarks
                SET list_type = ${list_type}, updated_at = ${updated_at}
                WHERE user_id = ${options.user_id} AND podcast_id = ${options.podcast_id}
            `;
        } else {
            await sql`
                INSERT INTO bookmarks (user_id, podcast_id, list_type, updated_at)
                VALUES (${options.user_id}, ${options.podcast_id}, ${list_type}, ${updated_at})
                ON CONFLICT (user_id, podcast_id) DO NOTHING;
            `;
        }

        return {
            status: "success",
            data: list_type,
        };
    } catch (error) {
        return {
            status: "error",
            message: "Database Error: Failed to add to bookmarks.",
            error: error,
        };
    }
}

export async function deleteFromBookmarks(user_id: string, podcast_id: string) {
    try {
        await sql`
            DELETE FROM bookmarks
            WHERE user_id = ${user_id} AND podcast_id = ${podcast_id}
        `;
    } catch (error) {
        return {
            status: "error",
            message: "Database Error: Failed to delete from bookmarks.",
            error: error,
        };
    }
}
