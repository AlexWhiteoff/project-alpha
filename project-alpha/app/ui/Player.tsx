import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { BackwardIcon, ForwardIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import React, { useContext } from "react";
import PlayerContext, { useAudioPlayer } from "../context/audioContext";

export default function Player() {
    const { isPlaying, playAudio, pauseAudio } = useAudioPlayer();

    return (
        <div className="flex w-full px-8 flex-row justify-between items-center gap-3 h-[75px] bg-gray-950 rounded-md">
            <div className="content">
                <div className="text-gray-100">TItle name placeholder</div>
                <div className="text-gray-400 text-sm">TItle author placeholder</div>
            </div>
            <div className="player-controls">
                <div className="flex flex-col justify-center gap-2">
                    <div className="flex flex-row justify-center items-center">
                        <div className="flex justify-between items-center gap-3">
                            <button className="flex justify-center items-center" title="Previous" onClick={() => {}}>
                                <BackwardIcon className="text-gray-100 w-6" />
                            </button>
                            {isPlaying ? (
                                <button
                                    className="flex justify-center items-center"
                                    title="Play"
                                    onClick={() => playAudio && playAudio()}
                                >
                                    <PlayIcon className="text-gray-100 w-6" />
                                </button>
                            ) : (
                                <button
                                    className="flex justify-center items-center"
                                    title="Pause"
                                    onClick={() => pauseAudio && pauseAudio()}
                                >
                                    <PauseIcon className="text-gray-100 w-6" />
                                </button>
                            )}
                            <button className="flex justify-center items-center" title="Next" onClick={() => {}}>
                                <ForwardIcon className="text-gray-100 w-6" />
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-row justify-between items-center gap-2">
                        <span className="text-sm text-gray-300">--/--</span>
                        <div className="h-1 w-[400px] bg-gray-50"></div>
                        <span className="text-sm text-gray-300">--/--</span>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex flex-row justify-center items-center gap-2">
                <SpeakerWaveIcon className="text-gray-100 w-6" />
                <div className="h-1 w-[100px] bg-gray-50"></div>
            </div>
        </div>
    );
}
