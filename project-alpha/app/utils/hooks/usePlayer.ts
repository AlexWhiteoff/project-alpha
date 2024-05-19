"use client";

import { useAudioRef } from "@/app/utils/context/audioContext";
import { usePodcastContext } from "@/app/utils/context/podcastContext";
import { Episode } from "@/app/lib/definitions";
import { useEffect, useRef, useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
interface UsePlayer {
    isPlaying: boolean;
    playAudio: () => void;
    pauseAudio: () => void;
    setEpisode: (episode: Episode) => void;
}

const usePlayer = (): UsePlayer => {
    const { audioRef } = useAudioRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const { state, dispatch } = usePodcastContext();
    const currentEpisode = state.currentEpisode;

    const playAudio = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };
    const pauseAudio = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    useEffect(() => {
        const handleEnded = () => {
            setIsPlaying(false);
        };

        const currAudioRef = audioRef.current;
        currAudioRef?.addEventListener("ended", handleEnded);

        return () => {
            currAudioRef?.removeEventListener("ended", handleEnded);
        };
    }, [audioRef]);

    useEffect(() => {
        if (currentEpisode && audioRef.current) {
            const src = baseURL + "/" + currentEpisode.src;
            console.log(src);
            audioRef.current.src = src;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentEpisode]);

    const setEpisode = (episode: Episode) => {
        dispatch({ type: "SET_EPISODE", payload: episode });
    };

    return {
        isPlaying,
        playAudio,
        pauseAudio,
        setEpisode,
    };
};

export default usePlayer;
