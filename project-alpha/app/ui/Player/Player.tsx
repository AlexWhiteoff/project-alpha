"use client";

import { useEffect, useState } from "react";
import { usePodcastContext } from "@/app/utils/context/podcastContext";
import usePlayer from "@/app/utils/hooks/usePlayer";
import {
    ArrowPathIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ChevronDownIcon,
    PauseCircleIcon,
    PlayCircleIcon,
    SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useAudioRef } from "@/app/utils/context/audioContext";
import { formatTime } from "@/app/ui/utils";
import styles from "@/app/ui/Styles/text.module.css";

const Player = () => {
    const { state, dispatch } = usePodcastContext();
    const { audioRef } = useAudioRef();
    const { episode } = state;
    const { playAudio, pauseAudio, loopAudio, changeVolume, skipForward, skipBackward, isPlaying, isLooping } =
        usePlayer();

    const [isVolumeMenuOpened, setIsVolumeMenuOpened] = useState(false);
    const [isPhonePlayerOpened, setIsPhonePlayerOpened] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const handleLoadedMetadata = () => {
            if (audioRef.current) {
                setDuration(audioRef.current.duration);
            }
        };

        const episodeAudio = audioRef.current;
        episodeAudio?.addEventListener("timeupdate", handleTimeUpdate);
        episodeAudio?.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            episodeAudio?.removeEventListener("timeupdate", handleTimeUpdate);
            episodeAudio?.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [audioRef]);

    const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = parseFloat(event.target.value);
        }
    };

    if (episode) {
        return (
            <>
                <div className="hidden md:flex flex-col justify-center gap-4 bg-neutral-800 w-full h-fit rounded-lg mx-6 my-4">
                    <div className="flex flex-col space-x-2 rounded-lg overflow-hidden">
                        <div className="w-64">
                            <Image
                                src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                alt="Episode"
                                className="aspect-square object-cover h-full w-full"
                                width={300}
                                height={300}
                                draggable={false}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mx-2">
                        <Link
                            href={`/p/episode/${episode.id}`}
                            className="transition-colors text-neutral-200 hover:text-blue-400 font-bold text-ellipsis overflow-hidden text-nowrap"
                        >
                            {episode.title}
                        </Link>
                        <Link
                            href={`/p/podcast/${episode.podcast_id}`}
                            className="transition-colors text-neutral-400 hover:text-neutral-300 text-ellipsis overflow-hidden text-md text-nowrap"
                        >
                            {episode.podcast_title}
                        </Link>
                    </div>

                    <div className="w-full flex items-center px-2">
                        <span className="flex items-center justify-end w-10 text-sm">{formatTime(currentTime)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="mx-4 flex-1"
                        />
                        <span className="flex items-center justify-start w-10 text-sm">{formatTime(duration)}</span>
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <button
                            className={clsx(
                                "relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700",
                                isLooping ? "text-blue-500" : "text-neutral-300"
                            )}
                            onClick={() => loopAudio()}
                        >
                            <ArrowPathIcon className="w-5" />
                        </button>

                        <button
                            className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                            onClick={() => skipBackward()}
                        >
                            <ArrowUturnLeftIcon className="w-6" />
                            <span className="absolute left-0 bottom-0 text-[10px]">15</span>
                        </button>

                        {!isPlaying ? (
                            <button
                                className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                onClick={() => playAudio()}
                            >
                                <PlayCircleIcon className="w-10 h-10" />
                            </button>
                        ) : (
                            <button
                                className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                onClick={() => pauseAudio()}
                            >
                                <PauseCircleIcon className="w-10 h-10" />
                            </button>
                        )}

                        <button
                            className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                            onClick={() => skipForward()}
                        >
                            <ArrowUturnRightIcon className="w-6" />
                            <span className="absolute right-0 bottom-0 text-[10px]">15</span>
                        </button>

                        <div className="relative">
                            <button
                                className="flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700 text-neutral-300"
                                onClick={() => setIsVolumeMenuOpened((prevState) => !prevState)}
                            >
                                <SpeakerWaveIcon className="w-5" />
                            </button>
                            <div
                                className={clsx(
                                    "absolute bottom-8 inset-x-0 p-3 bg-neutral-900 shadow-lg rounded-lg items-center justify-center",
                                    isVolumeMenuOpened ? "flex" : "hidden"
                                )}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    defaultValue="0.5"
                                    className="vertical"
                                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow"></div>
                </div>
                {!isPhonePlayerOpened ? (
                    <div className="fixed z-20 flex w-full items-center justify-center md:hidden bottom-20 left-0">
                        <div className="flex justify-between mx-3 bg-neutral-900 w-full h-fit rounded-lg">
                            <div className="flex" onClick={() => setIsPhonePlayerOpened(true)}>
                                <div className="flex p-2 rounded-lg">
                                    <div className="w-14">
                                        <Image
                                            src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                            alt="Episode"
                                            className="object-cover h-full w-full"
                                            width={100}
                                            height={100}
                                            draggable={false}
                                        />
                                    </div>
                                </div>

                                <div className="relative flex flex-col justify-center gap-1 w-36 max-w-full">
                                    <div
                                        className={`${styles.marquee} text-neutral-200 transition-colors text-md font-medium text-nowrap`}
                                    >
                                        <div>{episode.title}</div>
                                    </div>
                                    <div className="transition-colors text-neutral-400 text-sm text-ellipsis overflow-hidden text-md text-nowrap">
                                        {episode.podcast_title}
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex justify-center items-center gap-2 -left-6">
                                <button
                                    className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                                    onClick={() => skipBackward()}
                                >
                                    <ArrowUturnLeftIcon className="w-6" />
                                    <span className="absolute left-0 bottom-0 text-[10px]">15</span>
                                </button>

                                {!isPlaying ? (
                                    <button
                                        className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                        onClick={() => playAudio()}
                                    >
                                        <PlayCircleIcon className="w-10 h-10" />
                                    </button>
                                ) : (
                                    <button
                                        className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                        onClick={() => pauseAudio()}
                                    >
                                        <PauseCircleIcon className="w-10 h-10" />
                                    </button>
                                )}

                                <button
                                    className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                                    onClick={() => skipForward()}
                                >
                                    <ArrowUturnRightIcon className="w-6" />
                                    <span className="absolute right-0 bottom-0 text-[10px]">15</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="fixed z-20 flex w-full h-content justify-center shrink-0 flex-col md:hidden bottom-20 left-0 px-3">
                        <div className="relative flex flex-col justify-center gap-2 bg-neutral-900 rounded-lg overflow-hidden py-4 px-2">
                            <button
                                className="absolute top-3 left-3 flex gap-2 items-center p-3 text-neutral-400 hover:bg-neutral-700 rounded-full"
                                onClick={() => setIsPhonePlayerOpened(false)}
                            >
                                <ChevronDownIcon className="w-5" />
                            </button>

                            <div className="flex justify-center rounded-lg overflow-hidden">
                                <div className="w-48">
                                    <Image
                                        src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                        alt="Episode"
                                        className="object-cover h-full w-full"
                                        width={300}
                                        height={300}
                                        draggable={false}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mx-2">
                                <Link
                                    href={`/p/episode/${episode.id}`}
                                    className="transition-colors text-neutral-200 hover:text-blue-400 font-bold text-ellipsis overflow-hidden text-nowrap"
                                >
                                    {episode.title}
                                </Link>
                                <Link
                                    href={`/p/podcast/${episode.podcast_id}`}
                                    className="transition-colors text-neutral-400 hover:text-neutral-300 text-ellipsis overflow-hidden text-md text-nowrap"
                                >
                                    {episode.podcast_title}
                                </Link>
                            </div>

                            <div className="w-full flex items-center px-2">
                                <span className="flex items-center justify-end w-10 text-sm">
                                    {formatTime(currentTime)}
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleProgressChange}
                                    className="mx-4 flex-1"
                                />
                                <span className="flex items-center justify-start w-10 text-sm">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            <div className="flex justify-center items-center gap-4">
                                <button
                                    className={clsx(
                                        "relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700",
                                        isLooping ? "text-blue-500" : "text-neutral-300"
                                    )}
                                    onClick={() => loopAudio()}
                                >
                                    <ArrowPathIcon className="w-5" />
                                </button>

                                <button
                                    className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                                    onClick={() => skipBackward()}
                                >
                                    <ArrowUturnLeftIcon className="w-6" />
                                    <span className="absolute left-0 bottom-0 text-[10px]">15</span>
                                </button>

                                {!isPlaying ? (
                                    <button
                                        className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                        onClick={() => playAudio()}
                                    >
                                        <PlayCircleIcon className="w-10 h-10" />
                                    </button>
                                ) : (
                                    <button
                                        className="rounded-full hover:bg-neutral-700 focus:outline-none"
                                        onClick={() => pauseAudio()}
                                    >
                                        <PauseCircleIcon className="w-10 h-10" />
                                    </button>
                                )}

                                <button
                                    className="relative flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700"
                                    onClick={() => skipForward()}
                                >
                                    <ArrowUturnRightIcon className="w-6" />
                                    <span className="absolute right-0 bottom-0 text-[10px]">15</span>
                                </button>

                                <div className="relative">
                                    <button
                                        className="flex w-8 h-8 items-center justify-center rounded-full hover:bg-neutral-700 text-neutral-300"
                                        onClick={() => setIsVolumeMenuOpened((prevState) => !prevState)}
                                    >
                                        <SpeakerWaveIcon className="w-5" />
                                    </button>
                                    <div
                                        className={clsx(
                                            "absolute bottom-8 inset-x-0 p-3 bg-neutral-900 shadow-lg rounded-lg items-center justify-center",
                                            isVolumeMenuOpened ? "flex" : "hidden"
                                        )}
                                    >
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            defaultValue="0.5"
                                            className="vertical"
                                            onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
};

export default Player;
