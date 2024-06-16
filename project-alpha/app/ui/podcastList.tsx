import { Podcast } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/Styles/text.module.css";
import clsx from "clsx";
import { formatDateToLocal } from "./utils";

const PodcastList = ({ podcasts }: { podcasts: Podcast[] }) => {
    return (
        <div className="flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="max-h-dvh rounded-lg overflow-y-auto divide-y divide-neutral-700">
                    {podcasts && podcasts.length > 0 ? (
                        podcasts?.map((podcast) => (
                            <div key={podcast.id}>
                                <div className="transition-colors md:hover:bg-neutral-700 flex flex-row rounded-lg overflow-hidden items-center gap-4">
                                    <div className="flex md:hidden flex-col items-center gap-4 p-2">
                                        <Link
                                            href={"/p/podcast/" + podcast.id}
                                            className="flex w-full shrink-0 gap-3 items-center"
                                        >
                                            <div className="flex w-28 shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    alt={podcast.title}
                                                    src={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                                                    width={250}
                                                    height={250}
                                                    draggable={false}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 justify-between">
                                                <div className="flex flex-col">
                                                    <div className="text-neutral-100 font-bold">{podcast.title}</div>
                                                    <div
                                                        className={clsx(
                                                            "text-neutral-300 text-sm overflow-hidden",
                                                            styles.lineClamp
                                                        )}
                                                    >
                                                        {podcast.description}
                                                    </div>
                                                </div>
                                                <div className="flex w-full justify-between mb-3">
                                                    <span className="text-sm font-bold text-white capitalize">
                                                        {formatDateToLocal(podcast.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="hidden md:flex flex-row gap-4 transition-colors hover:bg-neutral-700 p-2">
                                        <Link
                                            href={"/p/podcast/" + podcast.id}
                                            className="flex w-32 shrink-0 rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                alt={podcast.title}
                                                src={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                                                width={250}
                                                height={250}
                                                draggable={false}
                                            />
                                        </Link>
                                        <div className="flex flex-col gap-1 justify-between">
                                            <div className="flex flex-col">
                                                <Link
                                                    href={"/p/podcast/" + podcast.id}
                                                    className="text-neutral-100 font-bold"
                                                >
                                                    {podcast.title}
                                                </Link>
                                                <div
                                                    className={clsx(
                                                        "text-neutral-300 text-md overflow-hidden",
                                                        styles.lineClamp
                                                    )}
                                                >
                                                    {podcast.description}
                                                </div>
                                            </div>
                                            <div className="flex w-full justify-between mb-3">
                                                <span className="text-sm font-bold text-white capitalize">
                                                    {formatDateToLocal(podcast.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-40 flex justify-center items-center">
                            <p className="text-neutral-300 font-medium">Нічого не знайдено</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PodcastList;
