"use client";

import { useAudioRef } from "@/app/utils/context/audioContext";
import { usePodcastContext } from "@/app/utils/context/podcastContext";
import { Episode } from "@/app/lib/definitions";
import { useEffect, useRef, useState } from "react";

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
        if (audioRef.current?.readyState !== 0) {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };
    const pauseAudio = () => {
        if (audioRef.current?.readyState !== 0) {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
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
        console.log("useEffect:\naudioRef.current: ", audioRef.current?.readyState);

        if (currentEpisode && audioRef.current) {
            audioRef.current.src = currentEpisode.src;
            playAudio();
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
