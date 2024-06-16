import { getSession } from "@/app/lib/actions/session";
import { fetchCategories, fetchPodcast, fetchTags } from "@/app/lib/data";
import EpisodeCreateForm from "@/app/ui/Forms/episodeCreateForm";
import PodcastCreateForm from "@/app/ui/Forms/podcast-create-form";
import AccessDenied from "@/app/ui/accessDenied";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Створення подкасту",
};

export default async function Page({ params }: { params: { podcastId: string } }) {
    const podcast_id = params.podcastId;
    const [podcast, session] = await Promise.all([fetchPodcast(podcast_id), getSession()]);

    if (!podcast) {
        notFound();
    }
    if (!session) {
        redirect("/");
    }

    const userRole = session?.role;
    if (podcast.author_id !== session?.userId && userRole !== "admin") {
        return <AccessDenied />;
    }

    if (userRole === "admin" || userRole === "content_creator") {
        return (
            <main className="flex min-h-full justify-center">
                <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto bg-neutral-800 p-4">
                    <div className="flex w-full">
                        <h1 className="font-medium text-xl text-neutral-300">Створення нового епізоду</h1>
                    </div>
                    <div>
                        <EpisodeCreateForm podcast_id={podcast_id} />
                    </div>
                </div>
            </main>
        );
    } else {
        return <AccessDenied />;
    }
}
