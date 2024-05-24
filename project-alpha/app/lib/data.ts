import { Episode, Podcast, User } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchEpisodes(id: string) {
    return await fetch(`${baseURL}/episodes.json`)
        .then((res) => res.json())
        .then((data) => data.filter((episode: Episode) => episode.podcast_id == id))
        .catch((err) => console.log(err));
}

export async function fetchEpisode(id: string) {
    return await fetch(`${baseURL}/episodes.json`)
        .then((response) => response.json())
        .then((data) => data.find((episode: Episode) => episode.id === id))
        .catch((err) => console.error(err));
}

export async function fetchPodcast(id: string) {
    return await fetch(`${baseURL}/podcasts.json`)
        .then((response) => response.json())
        .then((data) => data.find((podcast: Podcast) => podcast.id === id))
        .catch((err) => console.error(err));
}

export async function fetchAllPodcasts() {
    const res = await fetch("./podcasts.json")
        .then((response) => response.json())
        .catch((err) => console.log(err));
    console.log("Podcasts: ", res);
    return res;
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
        const user = await sql<User>`SELECT * FROM users WHERE email=${id}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}
