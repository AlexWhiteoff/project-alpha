import { Bookmarks, Categories, Episode, EpisodeTable, Podcast, Tags, User } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

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

export async function getUserBookmarks(user_id: string) {
    noStore();
    try {
        const data = await sql<Podcast>`
            SELECT Podcasts.id, Podcasts.title, Podcasts.description, Podcasts.avatar_url, Podcasts.is_active
            FROM Bookmarks
            JOIN Podcasts ON Bookmarks.podcast_id = Podcasts.id
            WHERE Bookmarks.user_id = ${user_id}
        `;
        return data.rows as Podcast[];
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
                id
                podcast_id
                title
                description
                audio_url
                image_url
                release_date
                is_active
            FROM episodes
            WHERE 
                podcast_id = ${podcastId} AND
                title ILIKE '%${query}%' OR 
                description ILIKE '%${query}%'
            ORDER BY release_date DESC

        `;
        return episodes.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episodes.");
    }
}
const ITEMS_PER_PAGE = 6;
export async function fetchEpisodesPages(podcastId: string, query: string) {
    noStore();
    try {
        const count = await sql`
            SELECT COUNT(*)
            FROM episodes
            WHERE 
                podcast_id = ${podcastId} AND
                title ILIKE '%${query}%' OR 
                description ILIKE '%${query}%'
        `;
        return Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch episodes.");
    }
}

export async function fetchEpisode(id: string) {
    return await fetch(`${baseURL}/episodes.json`)
        .then((response) => response.json())
        .then((data) => data.find((episode: Episode) => episode.id === id))
        .catch((err) => console.error(err));
}

export async function fetchAllPodcasts() {
    const res = await fetch("./podcasts.json")
        .then((response) => response.json())
        .catch((err) => console.log(err));
    console.log("Podcasts: ", res);
    return res;
}
