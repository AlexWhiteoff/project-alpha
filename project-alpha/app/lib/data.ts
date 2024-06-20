import {
    Bookmarks,
    Categories,
    Episode,
    EpisodeTable,
    EpisodeTableType,
    ExtendedEpisode,
    ExtendedPodcast,
    Podcast,
    PodcastsTableType,
    Tags,
    User,
    UserTableType,
} from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { validate } from "uuid";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ITEMS_PER_PAGE = 6;

export async function fetchCategories() {
    noStore();
    try {
        const data = await sql<Categories>`SELECT * FROM categories`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch categories.");
    }
}

export async function fetchTags() {
    noStore();
    try {
        const data = await sql<Tags>`SELECT * FROM tags`;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch categories.");
    }
}

export async function fetchPodcast(id: string) {
    noStore();
    if (!validate(id)) return null;
    try {
        const data = await sql<Podcast>`SELECT * FROM podcasts WHERE id = ${id}`;
        return data.rows[0] as Podcast;
    } catch (error) {
        console.error("Failed to fetch podcast:", error);
        throw new Error("Failed to fetch podcast.");
    }
}

export async function getPodcastCategories(podcast_id: string) {
    noStore();
    try {
        const data = await sql<Categories>`
            SELECT Categories.id, Categories.name
            FROM PodcastCategories
            JOIN Categories ON PodcastCategories.category_id = Categories.id
            WHERE PodcastCategories.podcast_id = ${podcast_id}
        `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch categories.");
    }
}

export async function getPodcastTags(podcast_id: string) {
    noStore();
    try {
        const data = await sql<Tags>`
            SELECT Tags.id, Tags.name
            FROM PodcastTags
            JOIN Tags ON PodcastTags.tag_id = tags.id
            WHERE PodcastTags.podcast_id = ${podcast_id}
        `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch tags.");
    }
}

export async function getFilteredPodcasts(
    query: string,
    sort_by: string,
    order: string,
    categories: string[],
    tags: string[],
    age: string[],
    status: string[],
    year_max: string,
    year_min: string,
    episode_max: string,
    episode_min: string
) {
    noStore();

    const whereClauses: string[] = ["Podcasts.is_active = true", "Podcasts.status != 'pending'"];
    const values: any[] = [];

    if (query) {
        whereClauses.push(
            `(Podcasts.title ILIKE '%' || $${values.length + 1} || '%' OR Podcasts.description ILIKE '%' || $${
                values.length + 1
            } || '%')`
        );
        values.push(`%${query}%`);
    }

    if (categories.length > 0) {
        whereClauses.push(`Podcasts.id IN (
                                SELECT podcast_id 
                                FROM podcastcategories 
                                JOIN Categories 
                                    ON podcastcategories.category_id = Categories.id 
                                WHERE Categories.name IN (${categories
                                    .map((_, i) => `$${i + values.length + 1}`)
                                    .join(", ")})
                            )`);
        values.push(...categories);
    }

    if (tags.length > 0) {
        whereClauses.push(`Podcasts.id IN (
                                SELECT podcast_id 
                                FROM podcastTags 
                                JOIN Tags 
                                    ON podcasttags.tag_id = Tags.id 
                                WHERE Tags.name IN (${tags.map((_, i) => `$${i + values.length + 1}`).join(", ")})
        )`);
        values.push(...tags);
    }

    if (age.length > 0) {
        whereClauses.push(`Podcasts.age_rating IN (${age.map((_, i) => `$${i + values.length + 1}`).join(", ")})`);
        values.push(...age);
    }

    if (status.length > 0) {
        whereClauses.push(`Podcasts.status IN (${status.map((_, i) => `$${i + values.length + 1}`).join(", ")})`);
        values.push(...status);
    }

    if (year_min) {
        whereClauses.push(`Podcasts.created_at >= $${values.length + 1}`);
        values.push(new Date(year_min));
    }

    if (year_max) {
        whereClauses.push(`Podcasts.created_at <= $${values.length + 1}`);
        values.push(new Date(year_max));
    }

    if (episode_min || episode_max) {
        whereClauses.push(`Podcasts.id IN (
                                SELECT podcast_id 
                                FROM (
                                    SELECT podcast_id, COUNT(*) as episode_count 
                                    FROM Episodes 
                                    GROUP BY podcast_id
                                ) as episode_counts 
                                WHERE 
                                    episode_counts.episode_count >= $${values.length + 1} AND
                                    episode_counts.episode_count <= $${values.length + 2}
        )`);
        values.push(episode_min || 0, episode_max || Number.MAX_SAFE_INTEGER);
    }

    const whereClause = whereClauses.length > 0 ? whereClauses.join(" AND ") : "";

    let sortByClause;
    switch (sort_by) {
        case "title":
            sortByClause = "Podcasts.title";
            break;
        case "updated_at":
            sortByClause = "Podcasts.updated_at";
            break;
        case "created_at":
            sortByClause = "Podcasts.created_at";
            break;
        default:
            sortByClause = "Podcasts.title";
            break;
    }
    sortByClause += ` ${order}`;

    const queryString = `
        SELECT 
            Podcasts.id, 
            Podcasts.title, 
            Podcasts.description, 
            Podcasts.avatar_url, 
            Podcasts.banner_url, 
            Podcasts.author_id, 
            Podcasts.is_active, 
            Podcasts.status, 
            Podcasts.age_rating, 
            Podcasts.created_at, 
            Podcasts.updated_at 
        FROM 
            Podcasts
        WHERE
            ${whereClause}
        ORDER BY
            ${sortByClause}
    `;

    try {
        const data = await sql.query(queryString, values);
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch podcasts.");
    }
}

export async function getUserBookmarks(
    user_id: string,
    list_type: Bookmarks["list_type"] | null,
    query: string,
    sort_by: "title" | "updated_at" | "created_at" | "bookmark_updated_at" = "bookmark_updated_at",
    order: "ASC" | "DESC" = "ASC"
) {
    noStore();
    if (!validate(user_id)) return null;

    try {
        let orderByColumn;
        switch (sort_by) {
            case "title":
                orderByColumn = "Podcasts.title";
                break;
            case "updated_at":
                orderByColumn = "Podcasts.updated_at";
                break;
            case "created_at":
                orderByColumn = "Podcasts.created_at";
                break;
            case "bookmark_updated_at":
                orderByColumn = "Bookmarks.updated_at";
                break;
            default:
                orderByColumn = "Bookmarks.updated_at";
        }
        orderByColumn += ` ${order}`;

        const sqlQuery = `
            SELECT 
                Bookmarks.list_type, 
                Podcasts.id, 
                Podcasts.title, 
                Podcasts.description, 
                Podcasts.avatar_url, 
                Podcasts.is_active,
                Podcasts.created_at,
                Podcasts.updated_at,
                Bookmarks.created_at AS bookmark_created_at,
                Bookmarks.updated_at AS bookmark_updated_at
            FROM 
                Bookmarks
            JOIN 
                Podcasts ON Bookmarks.podcast_id = Podcasts.id
            WHERE 
                Bookmarks.user_id = '${user_id}' 
                ${list_type ? `AND Bookmarks.list_type = '${list_type}'` : ""} 
                AND (Podcasts.title ILIKE '%' || '${query}' || '%' OR Podcasts.description ILIKE '%' || '${query}' || '%')
            ORDER BY
                ${orderByColumn}
        `;

        const data = await sql.query(sqlQuery);
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch bookmarks.");
    }
}

export async function getUserBookmarkByPodcastId(podcast_id: string, user_id: string) {
    noStore();
    try {
        const data = await sql<Bookmarks>`
            SELECT list_type
            FROM Bookmarks
            WHERE user_id = ${user_id} AND podcast_id = ${podcast_id};
        `;

        return data.rows[0]?.list_type ?? null;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch bookmarks.");
    }
}

export async function getUserByEmail(email: string) {
    noStore();
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function getUserById(id: string) {
    noStore();

    if (!validate(id)) return null;
    try {
        const user = await sql<User>`SELECT * FROM users WHERE id=${id}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}

export async function fetchFilteredEpisodes(podcastId: string, query: string) {
    noStore();

    try {
        const episodes = await sql<EpisodeTable>`
            SELECT 
                id,
                podcast_id,
                title,
                description,
                audio_url,
                image_url,    
                is_active,
                created_at
            FROM episodes
            WHERE 
                podcast_id = ${podcastId} AND
                (title ILIKE '%' || ${query} || '%' OR description ILIKE '%' || ${query} || '%')
            ORDER BY created_at DESC
        `;
        return episodes.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error(`Failed to fetch episodes. ${error}`);
    }
}

export async function fetchEpisode(episode_id: string) {
    noStore();
    if (!validate(episode_id)) return null;
    try {
        const data = await sql<ExtendedEpisode>`
            SELECT 
                e.*, 
                p.title as podcast_title, 
                u.username as author_name
            FROM 
                episodes e
            JOIN 
                Podcasts p ON e.podcast_id = p.id
            JOIN 
                Users u On p.author_id = u.id
            WHERE e.id = ${episode_id}
        `;
        return data.rows[0] as ExtendedEpisode;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function getPopularPodcasts() {
    noStore();

    try {
        const data = await sql<ExtendedPodcast>`
            SELECT 
                p.*, 
                COUNT(e.id) as episode_count, 
                u.username as author_name
            FROM Podcasts p
            JOIN 
                Episodes e ON p.id = e.podcast_id
            JOIN 
                Users u ON p.author_id = u.id
            WHERE 
                p.status != 'pending'
                AND p.is_active = true
            GROUP BY 
                p.id, u.username
            HAVING COUNT(e.id) > 0
            ORDER BY episode_count DESC
            LIMIT 10
        `;
        return data.rows as ExtendedPodcast[];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function getNewPodcasts() {
    noStore();
    try {
        const data = await sql<ExtendedPodcast>`
            SELECT 
                p.*, 
                COUNT(e.id) as episode_count, 
                u.username as author_name
            FROM Podcasts p
            JOIN 
                Episodes e ON p.id = e.podcast_id
            JOIN 
                Users u ON p.author_id = u.id
            WHERE 
                p.status != 'pending'
                AND p.is_active = true
            GROUP BY 
                p.id, u.username
            HAVING COUNT(e.id) > 0
            ORDER BY p.created_at DESC
            LIMIT 10
        `;
        return data.rows as ExtendedPodcast[];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function getRecentPodcasts() {
    noStore();
    try {
        const data = await sql<ExtendedPodcast>`
            SELECT 
                p.*, 
                COUNT(e.id) as episode_count, 
                u.username as author_name
            FROM Podcasts p
            JOIN 
                Episodes e ON p.id = e.podcast_id
            JOIN 
                Users u ON p.author_id = u.id
            WHERE 
                p.status != 'pending'
                AND p.is_active = true
            GROUP BY 
                p.id, u.username
            HAVING COUNT(e.id) > 0
            ORDER BY p.updated_at DESC
            LIMIT 10
        `;
        return data.rows as ExtendedPodcast[];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function getRecentEpisodes() {
    noStore();
    try {
        const data = await sql`
            SELECT 
                e.*, 
                u.username as author_name, 
                p.title as podcast_title
            FROM Episodes e
            JOIN 
                Podcasts p ON e.podcast_id = p.id
            JOIN
                Users u ON p.author_id = u.id
            WHERE 
                p.status != 'pending'
                AND p.is_active = true
                AND e.is_active = true
            ORDER BY e.created_at DESC
            LIMIT 10
        `;
        return data.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function fetchPodcastEpisodes(podcast_id: string) {
    noStore();
    if (!validate(podcast_id)) return [];
    try {
        const data = await sql<ExtendedEpisode>`
            SELECT 
                e.*, 
                p.title as podcast_title,
                u.id as author_id
            FROM 
                episodes e
            JOIN 
                Podcasts p ON e.podcast_id = p.id
            JOIN 
                Users u On p.author_id = u.id
            WHERE podcast_id = ${podcast_id}
            ORDER BY created_at ASC
        `;
        return data.rows as ExtendedEpisode[];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episode.");
    }
}

export async function fetchPodcastCardData() {
    noStore();

    try {
        const podcastCountPromise = sql`SELECT COUNT(*) FROM podcasts`;
        const podcastPendingCountPromise = sql`SELECT COUNT(*) FROM podcasts WHERE status = 'pending'`;
        const podcastActiveCountPromise = sql`SELECT COUNT(*) FROM podcasts WHERE is_active = 'true'`;
        const podcastInactiveCountPromise = sql`SELECT COUNT(*) FROM podcasts WHERE is_active = 'false'`;

        const data = await Promise.all([
            podcastCountPromise,
            podcastPendingCountPromise,
            podcastActiveCountPromise,
            podcastInactiveCountPromise,
        ]);

        const podcastCount = Number(data[0].rows[0].count ?? "0");
        const podcastPendingCount = Number(data[1].rows[0].count ?? "0");
        const podcastActiveCount = Number(data[2].rows[0].count ?? "0");
        const podcastInactiveCount = Number(data[3].rows[0].count ?? "0");

        return {
            podcastCount,
            podcastPendingCount,
            podcastActiveCount,
            podcastInactiveCount,
        };
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchEpisodesCardData() {
    noStore();

    try {
        const episodeCountPromise = sql`SELECT COUNT(*) FROM episodes`;
        const episodeLastMonthPromise = sql`SELECT COUNT(*) FROM episodes WHERE created_at >= NOW() - INTERVAL '1 month'`;
        const episodeActiveCountPromise = sql`SELECT COUNT(*) FROM episodes WHERE is_active = true`;
        const episodeInactiveCountPromise = sql`SELECT COUNT(*) FROM episodes WHERE is_active = false`;

        const data = await Promise.all([
            episodeCountPromise,
            episodeLastMonthPromise,
            episodeActiveCountPromise,
            episodeInactiveCountPromise,
        ]);

        const episodeCount = Number(data[0].rows[0].count ?? "0");
        const episodeLastMonth = Number(data[1].rows[0].count ?? "0");
        const episodeActiveCount = Number(data[2].rows[0].count ?? "0");
        const episodeInactiveCount = Number(data[3].rows[0].count ?? "0");

        return {
            episodeCount,
            episodeLastMonth,
            episodeActiveCount,
            episodeInactiveCount,
        };
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchUsersCardData() {
    noStore();

    try {
        const userCountPromise = sql`SELECT COUNT(*) FROM users`;
        const userLastMonthPromise = sql`SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '1 month'`;
        const userAdminsPromise = sql`SELECT COUNT(*) FROM users WHERE role = 'admin'`;
        const userCreatorsPromise = sql`SELECT COUNT(*) FROM users WHERE role = 'content_creator'`;

        const data = await Promise.all([
            userCountPromise,
            userLastMonthPromise,
            userAdminsPromise,
            userCreatorsPromise,
        ]);

        const userCount = Number(data[0].rows[0].count ?? "0");
        const userLastMonth = Number(data[1].rows[0].count ?? "0");
        const userAdmins = Number(data[2].rows[0].count ?? "0");
        const userCreators = Number(data[3].rows[0].count ?? "0");

        return {
            userCount,
            userLastMonth,
            userAdmins,
            userCreators,
        };
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch card data.");
    }
}

export async function fetchPodcastsTable(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const data = await sql<PodcastsTableType>`
        SELECT 
            p.id,
            p.title,
            p.avatar_url,
            p.author_id,
            u.username AS author_name,
            p.is_active,
            p.status,
            COUNT(e.id) AS total_episodes,
            p.created_at,
            p.updated_at
        FROM 
            Podcasts p
        JOIN 
            Users u ON p.author_id = u.id
        LEFT JOIN 
            Episodes e ON p.id = e.podcast_id
        WHERE
		    p.title ILIKE ${`%${query}%`} OR
            u.username ILIKE ${`%${query}%`} 
        GROUP BY 
            p.id, p.title, p.avatar_url, p.author_id, u.username, p.is_active, p.status, p.created_at, p.updated_at
        ORDER BY 
            p.created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    return data.rows as PodcastsTableType[];
}

export async function fetchEpisodesTable(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const data = await sql<EpisodeTableType>`
        SELECT 
            e.id,
            e.podcast_id,
            e.title,
            e.description,
            e.image_url,
            e.is_active,
            u.username AS author_name,
            u.id AS author_id,
            p.title AS podcast_title,
            p.is_active AS podcast_is_active,
            p.status,
            e.created_at,
            e.updated_at
        FROM 
            episodes e
        JOIN 
            podcasts p ON e.podcast_id = p.id
        JOIN 
            users u ON p.author_id = u.id
        WHERE
            e.title ILIKE ${`%${query}%`} OR
            e.description ILIKE ${`%${query}%`} OR
		    p.title ILIKE ${`%${query}%`} OR
            u.username ILIKE ${`%${query}%`} 
        ORDER BY 
            e.created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	`;

    return data.rows as EpisodeTableType[];
}

export async function fetchUsersTable(query: string, currentPage: number) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const data = await sql<UserTableType>`
        SELECT 
            id,
            email,
            username,
            birthday_date,
            gender,
            avatar_url,
            role,
            created_at,
            updated_at
        FROM 
            users
        WHERE
            username ILIKE ${`%${query}%`} OR
            email ILIKE ${`%${query}%`}
        ORDER BY 
            created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	`;

    return data.rows as UserTableType[];
}

export async function fetchUsersPages(query: string) {
    noStore();

    const count = await sql`
        SELECT COUNT(*)
        FROM users
        WHERE
            username ILIKE ${`%${query}%`} OR
            email ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
}

export async function fetchPodcastsPages(query: string) {
    noStore();

    const count = await sql`
        SELECT COUNT(*)
        FROM 
            Podcasts p
        JOIN 
            Users u ON p.author_id = u.id
        LEFT JOIN 
            Episodes e ON p.id = e.podcast_id
        WHERE
		    p.title ILIKE ${`%${query}%`} OR
            u.username ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
}

export async function fetchEpisodesPages(query: string) {
    noStore();

    try {
        const count = await sql`
            SELECT COUNT(*)
            FROM 
                episodes e
            JOIN 
                podcasts p ON e.podcast_id = p.id
            JOIN 
                users u ON p.author_id = u.id
            WHERE
                e.title ILIKE ${`%${query}%`} OR
                e.description ILIKE ${`%${query}%`} OR
		        p.title ILIKE ${`%${query}%`} OR
                u.username ILIKE ${`%${query}%`}
        `;
        return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episodes.");
    }
}
