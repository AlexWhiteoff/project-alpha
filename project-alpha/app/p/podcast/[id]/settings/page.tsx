import { getSession } from "@/app/lib/actions/session";
import {
    fetchCategories,
    fetchPodcast,
    fetchTags,
    getPodcastCategories,
    getPodcastTags,
    getUserById,
} from "@/app/lib/data";
import { Episode } from "@/app/lib/definitions";
import PodcastEditForm from "@/app/ui/Forms/podcast-edit-form";
import EpisodeList from "@/app/ui/Podcast/EpisodeList";
import usePlayer from "@/app/utils/hooks/usePlayer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;

    // fetch data
    const podcast = await fetchPodcast(id);

    if (!podcast)
        return {
            title: "Not Found",
        };

    const author = (await getUserById(podcast.author_id)).username;

    return {
        title: `Налаштування подкасту • ${podcast.title} • ${author}`,
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [podcast, user] = await Promise.all([fetchPodcast(id), getSession()]);

    if (!podcast || !user) redirect("/p/");

    const isAuthorized = podcast.author_id === user.userId || user.role === "admin";
    if (!isAuthorized) redirect(`/p/podcast/${id}`);

    const [podcastCategories, podcastTags, categories, tags] = await Promise.all([
        getPodcastCategories(podcast.id),
        getPodcastTags(podcast.id),
        fetchCategories(),
        fetchTags(),
    ]);

    const episodes: Episode[] = [];

    if (!podcast) {
        notFound();
    }

    return (
        <main className="flex min-h-full justify-center">
            <PodcastEditForm
                podcast={podcast}
                podcastCategories={podcastCategories}
                podcastTags={podcastTags}
                categories={categories}
                tags={tags}
                user_role={user.role}
            />
        </main>
    );
}
