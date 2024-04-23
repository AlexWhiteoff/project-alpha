"use client";

import { RefObject, createContext, useContext } from "react";

interface AudioRef {
    audioRef: RefObject<HTMLAudioElement>;
}

const AudioRefContext = createContext<AudioRef | null>(null);

export const useAudioRef = () => {
    const context = useContext(AudioRefContext);
    if (!context) {
        throw new Error("usePlayer must be used within an PlayerProvider");
    }
    return context;
};

export default AudioRefContext;
