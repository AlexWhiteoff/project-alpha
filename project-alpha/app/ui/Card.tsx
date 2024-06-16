import { ExtendedEpisode, ExtendedPodcast } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/ui/Styles/text.module.css";

export const PodcastCard = async ({ podcast }: { podcast: ExtendedPodcast }) => {
    return (
        <Link href={"/p/podcast/" + podcast.id} className="transition-colors hover:bg-neutral-700 rounded-lg p-2">
            <div className="flex flex-col gap-2 w-36 md:w-48">
                <div className="relative w-36 md:w-48 rounded-lg overflow-hidden">
                    <Image
                        src={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                        className="object-cover h-[100%]"
                        alt={podcast.title}
                        width={300}
                        height={300}
                    />
                    <div className="absolute bottom-2 text-xs left-2 z-10 px-2 py-1 bg-neutral-900/80">
                        Епізодів: {podcast.episode_count}
                    </div>
                </div>

                <h3 className="transition-colors text-neutral-200 hover:text-blue-400 font-bold text-ellipsis overflow-hidden text-nowrap">
                    {podcast.title}
                </h3>

                <p className="text-neutral-500 text-sm">{podcast.author_name}</p>
            </div>
        </Link>
    );
};

export const EpisodeCard = async ({ episode }: { episode: ExtendedEpisode }) => {
    return (
        <Link href={"/p/episode/" + episode.id} className="transition-colors hover:bg-neutral-700 rounded-lg p-2">
            <div className="flex flex-col gap-2 w-36 md:w-48">
                <div className="relative w-36 md:w-48 rounded-lg overflow-hidden">
                    <Image
                        src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                        className="object-cover h-[100%]"
                        alt={episode.title}
                        width={300}
                        height={300}
                    />
                    <div className="absolute bottom-2 text-xs left-2 z-10 px-2 py-1 bg-neutral-900/80">Епізод</div>
                </div>

                <h3 className="transition-colors text-neutral-200 hover:text-blue-400 font-bold text-ellipsis overflow-hidden text-nowrap">
                    {episode.title}
                </h3>

                <p className="text-neutral-500 text-sm">{episode.podcast_title}</p>
            </div>
        </Link>
    );
};
