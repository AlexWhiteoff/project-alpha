"use client";

import { PlayIcon } from "@heroicons/react/24/solid";
import { Episode } from "@/app/lib/definitions";
import usePlayer from "@/app/utils/hooks/usePlayer";

const PlayButton = ({ episode }: { episode: Episode }) => {
    const { setEpisode } = usePlayer();

    const handlePlayEpisode = (episode: Episode) => {
        setEpisode(episode);
    };

    return (
        <button
            className="flex justify-center items-center rounded-full bg-gray-950 text-gray-50 w-12 h-12 md:w-16 md:h-16 hover:bg-gray-800"
            onClick={() => handlePlayEpisode(episode)}
        >
            <PlayIcon className="w-6 h-6 md:w-8 md:h-8" />
        </button>
    );
};

export default PlayButton;
