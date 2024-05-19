import { Episode, Podcast } from "@/app/lib/definitions";
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
