import { getSession } from "@/app/lib/actions/session";
import {
    fetchPodcast,
    fetchPodcastEpisodes,
    getPodcastCategories,
    getPodcastTags,
    getUserBookmarkByPodcastId,
    getUserById,
} from "@/app/lib/data";
import EpisodeList from "@/app/ui/Episodes/EpisodeList";
import { AddToBookmarkButton } from "@/app/ui/addToBookmarkButton";
import { ListenPodcastButton } from "@/app/ui/buttons";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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

    const author = (await getUserById(podcast.author_id))?.username;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${podcast.title} • ${author}`,
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [podcast] = await Promise.all([fetchPodcast(id)]);

    if (!podcast) {
        notFound();
    }

    const [categories, tags, author, user, episodes] = await Promise.all([
        getPodcastCategories(podcast.id),
        getPodcastTags(podcast.id),
        getUserById(podcast.author_id),
        getSession(),
        fetchPodcastEpisodes(podcast.id),
    ]);
    const bookmarkList = user && (await getUserBookmarkByPodcastId(podcast.id, user.userId));

    const podcastStatusList = [
        { label: "Очікує на перевірку", value: "pending" },
        { label: "Анонсовано", value: "announced" },
        { label: "Триває", value: "ongoing" },
        { label: "Опубліковано", value: "published" },
        { label: "Припинено", value: "discontinued" },
    ];

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <div
                    className={`flex items-center justify-center w-full ${
                        podcast.banner_url ? "h-[200px] lg:h-[500px]" : "h-40"
                    }`}
                >
                    <Image
                        src={`/assets/podcasts/${id}/${podcast.banner_url}`}
                        alt="{podcast banner image}"
                        width={1168}
                        height={500}
                        draggable={false}
                        className="aspect-[21/9] object-cover h-full"
                    />
                </div>
                <div className="relative -mt-[50px] md:mt-0 flex flex-col items-center py-2 mx-4 md:mx-0 backdrop-blur bg-neutral-800/50 rounded-lg md:translate-y-0">
                    <div className="flex -mt-[50px] md:mt-0 items-center justify-center md:justify-between w-full px-4">
                        <div className="relative flex gap-4 items-center flex-col md:flex-row">
                            <div className="flex w-40 md:w-32 lg:w-56 xl:w-64 shrink-0">
                                <div className="md:absolute md:bottom-0 flex items-center justify-center overflow-hidden border-2 border-gray-950 md:w-32 lg:w-56 xl:w-64 md:border-0 rounded-lg">
                                    <Image
                                        src={`/assets/podcasts/${id}/${podcast.avatar_url}`}
                                        alt={`${podcast.title} cover`}
                                        width={288}
                                        height={288}
                                        draggable={false}
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex flex-col items-center md:items-start ">
                                <div className="hidden md:block text-sm">Подкаст</div>
                                <h1 className="text-2xl md:text-4xl font-bold">{podcast.title}</h1>
                            </div>
                        </div>
                        {(podcast.author_id === user?.userId || user?.role === "admin") && (
                            <div className="hidden md:block">
                                <Link
                                    href={`/p/podcast/${podcast.id}/settings`}
                                    className="flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                >
                                    <Cog6ToothIcon className="w-6" />
                                    <p className="hidden lg:inline-block">Налаштування</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 w-full border-t border-blue-600 pt-4 pb-2 mt-4 px-4 md:mt-4">
                        <div className="flex gap-2 w-full justify-center md:justify-end">
                            {user && (
                                <AddToBookmarkButton
                                    podcast_id={podcast.id}
                                    user_id={user.userId}
                                    bookmarkList={bookmarkList}
                                />
                            )}
                            <ListenPodcastButton episodes={episodes} />
                            {(podcast.author_id === user?.userId || user?.role === "admin") && (
                                <div className="block md:hidden">
                                    <Link
                                        href={`/p/podcast/${podcast.id}/settings`}
                                        className="flex transition-all items-center rounded-md p-2 hover:bg-gray-100 hover:text-gray-600"
                                    >
                                        <Cog6ToothIcon className="w-5" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex flex-col gap-4 w-full h-fit lg:w-1/3 py-4 px-4 lg:bg-neutral-800 rounded-lg">
                        {author && (
                            <div className="flex flex-col gap-1">
                                <p className="text-bold text-sm text-neutral-300">Автор</p>
                                <div className="w-full">
                                    <Link
                                        href={`/p/profile/${author.id}/`}
                                        className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700"
                                    >
                                        <span className="text-md text-nowrap">{author.username}</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <p className="text-bold text-sm text-neutral-300">Статус</p>
                            <div className="w-full">
                                <p className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700">
                                    <span className="text-md text-nowrap">
                                        {podcastStatusList.find((status) => status.value === podcast.status)?.label}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-bold text-sm text-neutral-300">Віковий рейтинг</p>
                            <div className="w-full">
                                <p className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700">
                                    <span className="text-md text-nowrap">
                                        {podcast.age_rating === "0" ? "Немає" : podcast.age_rating}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-bold text-sm text-neutral-300">Рік випуску</p>
                            <div className="w-full">
                                <p className="transition-all flex items-center px-2 py-1 rounded-md hover:bg-neutral-700">
                                    <span className="text-md text-nowrap">{format(podcast.created_at, "yyyy")}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4 w-full h-fit lg:w-2/3 py-4 px-4 lg:bg-neutral-800 rounded-lg">
                        <div className="lg:flex flex-col gap-2">
                            <p className="text-bold text-sm text-neutral-300">Про подкаст</p>
                            <div className="text-pretty text-justify">{podcast.description}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-bold text-sm text-neutral-300">Категорії</p>
                            <div className="flex items-center flex-wrap gap-2 justify-start w-full">
                                {categories.map((option) => (
                                    <Link
                                        key={option.id}
                                        href={`/p/catalog?categories=${option.name}`}
                                        className="transition-all flex items-center gap-2 border border-blue-600 px-2 py-1 rounded-md hover:bg-neutral-700"
                                    >
                                        <span className="text-sm text-nowrap">{option.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-bold text-sm text-neutral-300">Теги</p>
                            <div className="flex items-center flex-wrap gap-2 justify-start w-full">
                                {tags.map((option) => (
                                    <Link
                                        key={option.id}
                                        href={`/p/catalog?tags=${option.name}`}
                                        className="transition-all flex items-center gap-2 border border-blue-600 px-2 py-1 rounded-md hover:bg-neutral-700"
                                    >
                                        <span className="text-sm text-nowrap">{option.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col xl:flex-row-reverse gap-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-bold text-sm text-neutral-300">Епізоди</p>
                                <div className="flex items-center flex-wrap gap-2 justify-start w-full">
                                    {episodes.length !== 0 ? (
                                        <EpisodeList episodes={episodes} />
                                    ) : (
                                        <div>Тут ще нема епізодів!</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
