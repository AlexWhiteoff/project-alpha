import { useEffect, useState } from "react";
import { usePodcastContext } from "@/app/utils/context/podcastContext";
import usePlayer from "../../utils/hooks/usePlayer";
import { BackwardIcon, ForwardIcon, PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

const Player = () => {
    const { state, dispatch } = usePodcastContext();
    const { currentEpisode } = state;
    const { playAudio, pauseAudio, isPlaying } = usePlayer();

    useEffect(() => {
        if (currentEpisode) {
            console.log("Current episode changed:", currentEpisode);
            // Ваш код для оновлення інтерфейсу або логіки на підставі currentEpisode
        }
    }, [currentEpisode]);

    return (
        <div className="bg-gray-950 text-white p-4 rounded-md shadow-lg flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
                <div className="bg-gray-800 rounded-full p-2">
                    {/* <img src="path_to_image" alt="Episode" className="w-12 h-12 rounded-full" /> */}
                </div>
                <div>
                    <h4 className="text-lg font-semibold">{currentEpisode?.title}</h4>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="rounded-full hover:bg-gray-700 focus:outline-none">
                    <BackwardIcon className="w-10 h-10" />
                </button>

                {!isPlaying ? (
                    <button className="rounded-full hover:bg-gray-700 focus:outline-none" onClick={() => playAudio()}>
                        <PlayCircleIcon className="w-10 h-10" />
                    </button>
                ) : (
                    <button className="rounded-full hover:bg-gray-700 focus:outline-none" onClick={() => pauseAudio()}>
                        <PauseCircleIcon className="w-10 h-10" />
                    </button>
                )}
                <button className="rounded-full hover:bg-gray-700 focus:outline-none">
                    <ForwardIcon className="w-10 h-10" />
                </button>
            </div>

            <div className="flex-grow">
                <input
                    type="range"
                    className="hidden md:block w-full h-2 bg-gray-700 rounded-full cursor-pointer focus:outline-none"
                    value={0} 
                    min={0}
                    max={100}
                />
            </div>
        </div>
    );
};

export default Player;
