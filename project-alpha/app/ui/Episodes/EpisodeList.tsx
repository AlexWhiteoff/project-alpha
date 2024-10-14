import Image from "next/image";
import { UpdateEpisode, DeleteEpisode, PlayButton } from "@/app/ui/buttons";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Episode, ExtendedEpisode, User } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/ui/utils";
import clsx from "clsx";
import styles from "@/app/ui/Styles/text.module.css";

const EpisodeList = ({ episodes, isAuth }: { episodes: ExtendedEpisode[]; isAuth: boolean }) => {
    const filteredEpisodes = episodes.filter((episode) => {
        return episode.is_active || isAuth;
    });

    return (
        <div className="flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="max-h-dvh rounded-lg overflow-y-auto">
                    {filteredEpisodes.length > 0 ? (
                        filteredEpisodes?.map((episode) => (
                            <div
                                className="transition-colors md:hover:bg-neutral-700 py-2 flex flex-row rounded-lg overflow-hidden items-center gap-4"
                                key={episode.id}
                            >
                                <div className="flex md:hidden flex-col items-center gap-4 py-2">
                                    <Link
                                        href={"/p/episode/" + episode.id}
                                        className="flex w-full shrink-0 gap-3 items-center"
                                    >
                                        <div className="flex w-20 shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                alt={episode.title}
                                                src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                                width={250}
                                                height={250}
                                                draggable={false}
                                                className="aspect-square"
                                            />
                                        </div>
                                        <div className="text-neutral-100 font-bold">{episode.title}</div>
                                    </Link>
                                    <div className="flex flex-col gap-1">
                                        <div
                                            className={clsx(
                                                "text-neutral-300 text-sm overflow-hidden",
                                                styles.lineClamp
                                            )}
                                        >
                                            {episode.description}
                                        </div>
                                        <div className="text-sm text-white font-bold my-1">
                                            {formatDateToLocal(episode.created_at)}
                                        </div>
                                        <div className="flex gap-3 items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <UpdateEpisode id={episode.id} />
                                                <DeleteEpisode id={episode.id} />
                                            </div>
                                            <PlayButton episode={episode} />
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-row items-center gap-4 transition-colors hover:bg-neutral-700 p-2">
                                    <Link
                                        href={"/p/episode/" + episode.id}
                                        className="flex w-32 shrink-0 rounded-lg overflow-hidden"
                                    >
                                        <Image
                                            alt={episode.title}
                                            src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                            width={250}
                                            height={250}
                                            draggable={false}
                                            className="aspect-square"
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-1">
                                        <Link href={"/p/episode/" + episode.id} className="text-neutral-100 font-bold">
                                            {episode.title}
                                        </Link>
                                        <div
                                            className={clsx(
                                                "text-neutral-300 text-md overflow-hidden",
                                                styles.lineClamp
                                            )}
                                        >
                                            {episode.description}
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="text-sm text-white font-bold my-1">
                                                {formatDateToLocal(episode.created_at)}
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                {isAuth && (
                                                    <>
                                                        <UpdateEpisode id={episode.id} />
                                                        <DeleteEpisode id={episode.id} />
                                                    </>
                                                )}
                                                <PlayButton episode={episode} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center">
                            <p className="text-neutral-300 font-medium">Епізоди не знайдено</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default EpisodeList;
