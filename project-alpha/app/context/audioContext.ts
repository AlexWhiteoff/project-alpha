"use client";

import { createContext, useContext } from "react";

interface PlayerContextProps {
    isPlaying: boolean;
    playAudio?: () => void;
    pauseAudio?: () => void;
    currTrack: any;
    setCurrTrack: React.Dispatch<React.SetStateAction<any>>;
}

const PlayerContext = createContext<PlayerContextProps | null>(null);

export const useAudioPlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
    }
    return context;
};

export default PlayerContext;
