import { getSession } from "@/app/lib/actions/session";
import { fetchEpisode, fetchPodcast } from "@/app/lib/data";
import EpisodeEditForm from "@/app/ui/Forms/episodeEditForm";
import AccessDenied from "@/app/ui/accessDenied";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Редагування епізоду",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const episode = await fetchEpisode(id);

    if (!episode) {
        notFound();
    }

    const [podcast, session] = await Promise.all([fetchPodcast(episode.podcast_id), getSession()]);

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
                        <h1 className="font-medium text-xl text-neutral-300">Редагування епізоду</h1>
                    </div>
                    <div>
                        <EpisodeEditForm episode={episode} />
                    </div>
                </div>
            </main>
        );
    } else {
        return <AccessDenied />;
    }
}
