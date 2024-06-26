    "use server";

    import {
        BookmarksFormState,
        Bookmarks,
        PodcastFormSchema,
        PodcastFormState,
        addToBookmarkSchema,
        EpisodeFormState,
        EpisodeFormSchema,
        EditEpisodeFormSchema,
        UserFormState,
        UserFormSchema,
        SessionPayload,
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
    import { v4, validate } from "uuid";
    import { editSession, getSession } from "./session";
    import { revalidatePath } from "next/cache";
    import { redirect } from "next/navigation";
    import { overwriteFile, removePodcastFiles, saveFile } from "../utils";

    const CreatePodcast = PodcastFormSchema.omit({
        id: true,
        author_id: true,
        is_active: true,
        status: true,
        created_at: true,
        updated_at: true,
    });

    const EditUser = UserFormSchema.omit({
        id: true,
        email: true,
        password: true,
        created_at: true,
        updated_at: true,
    });

    const CreateEpisode = EpisodeFormSchema.omit({
        id: true,
        podcast_id: true,
        is_active: true,
        duration: true,
        created_at: true,
        updated_at: true,
    });

    const EditEpisode = EditEpisodeFormSchema.omit({
        id: true,
        podcast_id: true,
        duration: true,
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

        await saveFile(avatar_url, podcast.id, avatar);
        banner_url && (await saveFile(banner_url, podcast.id, banner));

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

    export async function createEpisode(state: EpisodeFormState, formData: FormData) {
        // checking authorization
        const podcast_id = formData.get("podcast_id") as string;
        const session = await getSession();

        if (!session) {
            redirect("/");
        }

        if (!validate(podcast_id)) {
            return {
                message: "Неправильний ідентифікатор подкасту",
            };
        }

        const podcast = await fetchPodcast(podcast_id);

        if (!podcast) {
            return {
                message: "Неправильний ідентифікатор подкасту",
            };
        }

        if (podcast.author_id !== session?.userId && session.role !== "admin") {
            return {
                message: "Немає доступу",
            };
        }

        // validation of the form data
        const validatedFields = CreateEpisode.safeParse({
            title: formData.get("title"),
            description: formData.get("description"),
            image: formData.get("image"),
            audio: formData.get("audio"),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Відсутні обов'язкові поля. Створення епізоду не вдалося.",
            };
        }

        // Getting data from validated fields
        const { title, description, image, audio } = validatedFields.data;

        // Processing audio and image data
        const image_url = `${v4()}.${image.name.split(".").pop()}`;
        const audio_url = `${v4()}.${audio.name.split(".").pop()}`;

        // inserting row to the db
        const result = await sql`
                INSERT INTO episodes (podcast_id, title, description, audio_url, image_url)
                VALUES (${podcast_id}, ${title}, ${description}, ${audio_url}, ${image_url})
                RETURNING id
                `;

        const episode = result.rows[0];

        if (!episode) {
            return {
                message: "Під час створення нового епізоду виникла помилка.",
            };
        }

        await saveFile(`${episode.id}/${audio_url}`, podcast.id, audio);
        await saveFile(`${episode.id}/${image_url}`, podcast.id, image);

        revalidatePath(`/p/episode/create/${episode.id}`);
        redirect(`/p/podcast/${podcast_id}`);
    }

    export async function editPodcast(state: PodcastFormState, formData: FormData) {
        const action = formData.get("action") as string;
        const id = formData.get("id") as string;

        if (!id || !validate(id)) {
            return { message: "Неправильний ідентифікатор подкасту." };
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
                        Promise.all([
                            overwriteFile(filePath, value),
                            sql`
                                UPDATE podcasts
                                SET updated_at = ${updated_at}
                                WHERE id = ${id}
                            `,
                        ]); 
                    } else if (key === "banner") {
                        const banner_url = podcast.banner_url || `${v4()}.${value.name.split(".").pop()}`;
                        const filePath = `/assets/podcasts/${id}/${banner_url}`;
                        Promise.all([
                            overwriteFile(filePath, value),
                            sql`
                                UPDATE podcasts
                                SET updated_at = ${updated_at}, banner_url = ${banner_url}
                                WHERE id = ${id}
                            `,
                        ]);
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
                    status: formData.get("status"),
                };

                const UpdatePodcast = PodcastFormSchema.pick({
                    is_active: true,
                    status: true,
                }).partial();

                const validatedFields = UpdatePodcast.safeParse(dataToValidate);

                if (!validatedFields.success) {
                    return {
                        errors: validatedFields.error.flatten().fieldErrors,
                        message: "Validation error. Please check your input.",
                    };
                }

                const { is_active, status } = validatedFields.data;

                await sql`
                    UPDATE podcasts
                    SET is_active = ${is_active}, status = ${status}, updated_at = ${updated_at}
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

    export async function editEpisode(id: string, podcast_id: string, state: EpisodeFormState, formData: FormData) {
        // checking authorization
        if (!validate(id))
            return {
                message: "Неправильний ідентифікатор епізоду",
            };

        // validation of the form data
        const fields: Record<string, unknown> = {
            title: formData.get("title"),
            description: formData.get("description"),
            is_active: (formData.get("is_active") as string) === "true",
        };

        const imageField = formData.get("image") === "null" ? null : (formData.get("image") as File);
        if (imageField) {
            fields.image = imageField;
        }

        const audioField = formData.get("audio") === "null" ? null : (formData.get("audio") as File);
        if (audioField) {
            fields.audio = audioField;
        }

        const validatedFields = EditEpisode.safeParse(fields);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Відсутні обов'язкові поля. Створення епізоду не вдалося.",
            };
        }

        // Getting data from validated fields
        const { title, description, image, audio, is_active } = validatedFields.data;

        const updated_at = new Date().toISOString().split("T")[0];

        try {
            // updating row in the db
            const result = await sql`
                UPDATE episodes
                SET title = ${title}, description = ${description}, is_active = ${is_active}, updated_at = ${updated_at}
                WHERE id = ${id}
                RETURNING image_url, audio_url;
            `;

            const episode = result.rows[0];

            if (!episode) {
                return {
                    message: "Під час редагування епізоду виникла помилка.",
                };
            }

            const episode_assets_path = `/assets/podcasts/${podcast_id}/${id}/`;
            if (image) await overwriteFile(episode_assets_path + episode.image_url, image);
            if (audio) await overwriteFile(episode_assets_path + episode.audio_url, audio);
        } catch (err) {
            console.log(err);
            return {
                message: "Database Error: Failed to update episode.",
                error: err,
            };
        }

        revalidatePath(`/p/episode/${id}/`);
        redirect(`/p/episode/${id}/`);
    }

    export async function editUser(id: string, state: UserFormState, formData: FormData) {
        if (!validate(id))
            return {
                message: "Неправильний ідентифікатор користувача",
            };

        const fields: Record<string, unknown> = {
            username: formData.get("username"),
            birthday_day: Number(formData.get("birthday_day")),
            birthday_month: Number(formData.get("birthday_month")),
            birthday_year: Number(formData.get("birthday_year")),
            gender: formData.get("gender"),
        };

        const avatarField = formData.get("avatar") === "null" ? null : (formData.get("avatar") as File);
        if (avatarField) {
            fields.avatar = avatarField;
        }

        const bannerField = formData.get("banner") === "null" ? null : (formData.get("banner") as File);
        if (bannerField) {
            fields.banner = bannerField;
        }

        const roleField = formData.get("role") ? formData.get("role") : null;
        if (roleField) {
            fields.role = roleField;
        }

        const validatedFields = EditUser.safeParse(fields);
        console.log(validatedFields.data);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Відсутні обов'язкові поля. Створення епізоду не вдалося.",
            };
        }

        const { username, gender, role, birthday_day, birthday_month, birthday_year, avatar, banner } =
            validatedFields.data;

        const updated_at = new Date().toISOString().split("T")[0];
        const birthday_date = `${birthday_year}-${birthday_month}-${birthday_day}`;

        console.log(birthday_day, birthday_month, birthday_year);
        console.log(birthday_date);

        try {
            const result = await sql`
                UPDATE users
                SET 
                    username = ${username}, 
                    gender = ${gender}, 
                    birthday_date = ${birthday_date},
                    updated_at = ${updated_at}
                WHERE id = ${id}
                RETURNING avatar_url, banner_url;
            `;

            const user = result.rows[0];

            if (!user) {
                return {
                    message: "Під час редагування користувача виникла помилка.",
                };
            }

            const user_assets_path = `/assets/users/${id}/`;
            const session = await getSession();

            let avatar_url;

            if (avatar) {
                avatar_url = user.avatar_url ? user.avatar_url : `${v4()}.${avatar.name.split(".").pop()}`;
                await overwriteFile(user_assets_path + avatar_url, avatar);

                if (!user.avatar_url) {
                    await sql`UPDATE users SET avatar_url = ${avatar_url} WHERE id = ${id}`;
                }
            }
            if (banner) {
                const banner_url = user.banner_url ? user.banner_url : `${v4()}.${banner.name.split(".").pop()}`;
                await overwriteFile(user_assets_path + banner_url, banner);

                if (!user.banner_url) {
                    await sql`UPDATE users SET banner_url = ${banner_url} WHERE id = ${id}`;
                }
            }
            if (role) {
                await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
            }

            if (session && session.userId === id) {
                const res = await editSession({
                    userId: id,
                    role: role || session.role,
                    name: username,
                    avatar_url: avatar_url || session.avatar_url,
                });
                if (res.ok) {
                    console.log("Session updated successfully");
                }
            }
        } catch (err) {
            console.log(err);
            return {
                message: "Database Error: Failed to update episode.",
                error: err,
            };
        }

        revalidatePath(`/p/profile/${id}/`);
        redirect(`/p/profile/${id}/`);
    }

    export async function deleteEpisode(id: string) {
        try {
            await sql`DELETE FROM episodes WHERE id = ${id}`;
            revalidatePath(`/p/episode/${id}`);
            return { message: "Епізод видалено." };
        } catch (err) {
            return {
                message: "Database Error: Failed to delete episode.",
                error: err,
            };
        }
    }

    export async function deletePodcast(id: string) {
        try {
            await Promise.all([sql`DELETE FROM podcasts WHERE id = ${id}`, removePodcastFiles(id)]);

            revalidatePath(`/p/podcast/`);
            return { message: "Подкаст видалено." };
        } catch (err) {
            return {
                message: "Database Error: Failed to delete podcast.",
                error: err,
            };
        }
    }

    export async function deleteUser(id: string) {
        try {
            await sql`DELETE FROM users WHERE id = ${id}`;
            revalidatePath(`/p/profile/`);
            return { message: "Користувача видалено." };
        } catch (err) {
            return {
                message: "Database Error: Failed to delete podcast.",
                error: err,
            };
        }
    }

    export async function addToBookmarks(options: {
        user_id: string;
        podcast_id: string;
        list_type: Bookmarks["list_type"];
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
