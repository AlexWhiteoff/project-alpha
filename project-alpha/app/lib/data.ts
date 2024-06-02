import { Categories, Episode, Podcast, Tags, User } from "@/app/lib/definitions";
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
