import { Episode } from "@/app/lib/definitions";
import usePlayer from "@/app/utils/hooks/usePlayer";
import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const EpisodeList = ({ episodes }: { episodes: Episode[] }) => {
    return (
        <div className="flex flex-wrap flex-col gap-4 divide-y divide-gray-300">
            {episodes.map((episode: Episode) => (
                <Link
                    className="relative hover:bg-gray-300 p-2 flex flex-row items-center gap-4 z-0"
                    key={episode.id}
                    href={"/episode/" + episode.id}
                >
                    <div>
                        <div className="w-[100px] h-[100px] rounded overflow-hidden">
                            <Image alt={episode.title} src={episode.image} width={100} height={100} />
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-950 font-bold">{episode.title}</div>
                        <div className="text-gray-950 h-12 text-ellipsis overflow-hidden">{episode.description}</div>
                        <div className="text-sm text-gray-950 font-bold">{episode.release_date}</div>
                        <div>
                            <div></div>
                            <button className="relative w-8 h-8 flex justify-center items-center rounded-full z-10">
                                <PlayIcon className="w-8 h-8 hover:text-gray-50 text-gray-950" />
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
export default EpisodeList;
