"use client";

import { useAudioRef } from "@/app/utils/context/audioContext";
import { usePodcastContext } from "@/app/utils/context/podcastContext";
import { ExtendedEpisode } from "@/app/lib/definitions";
import { useCallback, useEffect, useRef, useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
interface UsePlayer {
    isPlaying: boolean;
    isLooping: boolean;
    playAudio: () => void;
    pauseAudio: () => void;
    loopAudio: () => void;
    changeVolume: (volume: number) => void;
    skipForward: () => void;
    skipBackward: () => void;
    setEpisode: (episode: ExtendedEpisode) => void;
}

const usePlayer = (): UsePlayer => {
    const { audioRef } = useAudioRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const { state, dispatch } = usePodcastContext();
    const episode = state.episode;

    const playAudio = useCallback(() => {
        audioRef.current?.play();
        setIsPlaying(true);
    }, [audioRef]);

    const pauseAudio = useCallback(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
    }, [audioRef]);

    const loopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.loop = !audioRef.current.loop;
            setIsLooping(audioRef.current.loop);
        }
    }, [audioRef]);

    const changeVolume = useCallback(
        (volume: number) => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
            }
        },
        [audioRef]
    );

    const skipForward = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime += 15;
        }
    }, [audioRef]);

    const skipBackward = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime -= 15;
        }
    }, [audioRef]);

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
        if (episode && audioRef.current) {
            const src = `/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.audio_url}`;
            audioRef.current.src = src;
            playAudio();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episode]);

    const setEpisode = useCallback(
        (episode: ExtendedEpisode) => {
            dispatch({ type: "SET_EPISODE", payload: episode });
        },
        [dispatch]
    );

    return {
        isPlaying,
        isLooping,
        playAudio,
        pauseAudio,
        loopAudio,
        changeVolume,
        skipForward,
        skipBackward,
        setEpisode,
    };
};

export default usePlayer;
