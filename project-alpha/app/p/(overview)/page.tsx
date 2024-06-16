import { getSession } from "@/app/lib/actions/session";
import { getNewPodcasts, getPopularPodcasts, getRecentEpisodes, getRecentPodcasts } from "@/app/lib/data";
import { ExtendedEpisode, ExtendedPodcast } from "@/app/lib/definitions";
import { PodcastCard, EpisodeCard } from "@/app/ui/Card";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    if (!session) redirect("/");

    const [newPodcasts, popularPodcasts, recentEpisodes, recentPodcasts] = await Promise.all([
        getNewPodcasts(),
        getPopularPodcasts(),
        getRecentEpisodes(),
        getRecentPodcasts(),
    ]);

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto p-2">
                <div className="hidden md:flex flex-row justify-between items-center px-6 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">З поверненням, {session.name}!</h1>
                </div>
                <div className="flex flex-col gap-2 px-2 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-md md:text-xl text-neutral-400 md:text-neutral-300 font-bold px-2">
                        Останні оновлення
                    </h1>
                    <div className="flex flex-row gap-2 no-scrollbar overflow-x-auto">
                        {recentPodcasts.map((podcast) => (
                            <PodcastCard key={podcast.id} podcast={podcast as ExtendedPodcast} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 px-2 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-md md:text-xl text-neutral-400 md:text-neutral-300 font-bold px-2">
                        Нові епізоди
                    </h1>
                    <div className="flex flex-row gap-2 no-scrollbar overflow-x-auto">
                        {recentEpisodes.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode as ExtendedEpisode} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 px-2 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-md md:text-xl text-neutral-400 md:text-neutral-300 font-bold px-2">
                        Популярні подкасти
                    </h1>
                    <div className="flex flex-row gap-2 no-scrollbar overflow-x-auto">
                        {popularPodcasts.map((podcast) => (
                            <PodcastCard key={podcast.id} podcast={podcast as ExtendedPodcast} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 px-2 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-md md:text-xl text-neutral-400 md:text-neutral-300 font-bold px-2">
                        Нові подкасти
                    </h1>
                    <div className="flex flex-row gap-2 no-scrollbar overflow-x-auto">
                        {newPodcasts.map((podcast) => (
                            <PodcastCard key={podcast.id} podcast={podcast as ExtendedPodcast} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
