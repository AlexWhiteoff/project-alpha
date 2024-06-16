import { getSession } from "@/app/lib/actions/session";
import { fetchEpisode, fetchPodcast, fetchPodcastEpisodes, getUserById } from "@/app/lib/data";
import { Episode } from "@/app/lib/definitions";
import { DeleteEpisode, ShareButton, UpdateEpisode, PlayButton } from "@/app/ui/buttons";
import { formatDateToLocal } from "@/app/ui/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const episode = await fetchEpisode(id);

    if (!episode) {
        notFound();
    }

    const [podcast, session, episodes] = await Promise.all([
        fetchPodcast(episode.podcast_id),
        getSession(),
        fetchPodcastEpisodes(episode.podcast_id),
    ]);

    if (!podcast) {
        notFound();
    }

    const author = episode.author_name;

    if (!session) {
        redirect("/");
    }

    function splitEpisodesById(episodes: Episode[], episode_id: string) {
        const currentIndex = episodes.findIndex((episode) => episode.id === episode_id);

        if (currentIndex === -1) {
            throw new Error("Теперішній епізод не знайдено в масиві");
        }

        const previousEpisodes = episodes.slice(0, currentIndex);
        const nextEpisodes = episodes.slice(currentIndex + 1);

        return { previousEpisodes, nextEpisodes };
    }

    const isAuthorized = podcast.author_id === session.userId || session.role === "admin";

    const { previousEpisodes, nextEpisodes } = splitEpisodesById(episodes, id);

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <div className="hidden md:flex flex-col justify-center px-6 py-3 mx-4 mt-4 md:m-0 bg-neutral-800 rounded-lg">
                    <div className="text-sm text-neutral-400">Епізод</div>
                    <h1 className="text-2xl md:text-4xl font-bold">{episode.title}</h1>
                </div>

                <div className="flex w-full flex-col lg:flex-row gap-4">
                    <div className="flex flex-col gap-4 w-full h-fit lg:w-1/3 xl:w-1/4 py-4 px-4 lg:bg-neutral-800 rounded-lg">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center shrink-0 overflow-hidden border-2 border-gray-950 w-56 lg:w-40 xl:w-64 md:border-0 rounded-lg">
                                <Image
                                    src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                    alt={episode.title}
                                    width={288}
                                    height={288}
                                    draggable={false}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                        </div>
                        <div className="md:hidden flex-col justify-center px-6 py-3 md:m-0 bg-neutral-800 rounded-lg">
                            <div className="text-sm text-neutral-400">Епізод</div>
                            <h1 className="text-2xl md:text-4xl font-bold">{episode.title}</h1>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div className="flex gap-3 items-center">
                                {isAuthorized && (
                                    <>
                                        <UpdateEpisode id={episode.id} />
                                        <DeleteEpisode id={episode.id} />
                                    </>
                                )}
                                <ShareButton />
                            </div>
                            <div className="flex">
                                <PlayButton episode={episode} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-bold text-sm text-neutral-300">Подкаст</p>
                            <div className="w-full">
                                <Link
                                    href={`/p/podcast/${podcast.id}`}
                                    className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700"
                                >
                                    <span className="text-md text-nowrap">{podcast.title}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="w-full">
                            <p className="text-bold text-sm text-neutral-300">Автор</p>
                            <Link
                                href={`/p/profile/${podcast.author_id}/`}
                                className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700"
                            >
                                <span className="text-md text-nowrap">{author}</span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-bold text-sm text-neutral-300">Дата випуску</p>
                            <div className="w-full">
                                <div className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700">
                                    <span className="text-md text-nowrap">{formatDateToLocal(episode.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-6 w-full h-fit lg:w-2/3 xl:w-3/4 py-4 px-4 lg:bg-neutral-800 rounded-lg box-border">
                        <div className="lg:flex flex-col gap-2">
                            <p className="text-bold text-sm text-neutral-300">Про епізод</p>
                            <div className="text-pretty text-justify">{podcast.description}</div>
                        </div>
                        {nextEpisodes.length > 0 && (
                            <div className="flex flex-col gap-2 w-full">
                                <h1 className="text-bold text-sm text-neutral-300">Наступні епізоди цього подкасту</h1>
                                <div className="flex w-full overflow-hidden">
                                    <div className="flex overflow-x-auto flex-nowrap">
                                        <div className="flex flex-row">
                                            {nextEpisodes.map((item) => (
                                                <div key={item.id} className="flex">
                                                    <Link
                                                        href={`/p/episode/${item.id}`}
                                                        className="transition-all p-2 rounded-md hover:bg-neutral-700"
                                                    >
                                                        <div className="flex gap-2 flex-col justify-center">
                                                            <div className="flex w-48 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={`/assets/podcasts/${item.podcast_id}/${item.id}/${item.image_url}`}
                                                                    alt={item.title}
                                                                    width={300}
                                                                    height={300}
                                                                    className="object-cover h-full w-full"
                                                                ></Image>
                                                            </div>
                                                            <span className="text-md text-pretty text-nowrap">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-md text-pretty text-nowrap">
                                                                {formatDateToLocal(item.created_at)}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {previousEpisodes.length > 0 && (
                            <div className="flex flex-col gap-2 w-full">
                                <h1 className="text-bold text-sm text-neutral-300">Минулі епізоди цього подкасту</h1>
                                <div className="flex w-full overflow-hidden">
                                    <div className="flex overflow-x-auto flex-nowrap">
                                        <div className="flex flex-row">
                                            {previousEpisodes.map((item) => (
                                                <div key={item.id} className="flex">
                                                    <Link
                                                        href={`/p/episode/${item.id}`}
                                                        className="transition-all p-2 rounded-md hover:bg-neutral-700"
                                                    >
                                                        <div className="flex gap-2 flex-col justify-center">
                                                            <div className="flex w-48 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={`/assets/podcasts/${item.podcast_id}/${item.id}/${item.image_url}`}
                                                                    alt={item.title}
                                                                    width={300}
                                                                    height={300}
                                                                    className="object-cover h-full w-full"
                                                                ></Image>
                                                            </div>
                                                            <span className="text-md text-pretty text-nowrap">
                                                                {item.title}
                                                            </span>
                                                            <span className="text-md text-pretty text-nowrap">
                                                                {formatDateToLocal(item.created_at)}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
