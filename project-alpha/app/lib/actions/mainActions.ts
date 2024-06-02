"use server";

import { PodcastFormSchema, PodcastFormState } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { fetchCategories, fetchTags } from "../data";
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
