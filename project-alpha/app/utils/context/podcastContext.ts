import { createContext, Dispatch, useContext } from "react";
import { Episode } from "@/app/lib/definitions";

// Оголосіть типи для стану та дій
export interface PodcastState {
    currentEpisode: Episode | null;
}

export type PodcastAction = { type: "SET_EPISODE"; payload: Episode } | { type: "CLEAR_EPISODE" };

interface PodcastContextProps {
    state: PodcastState;
    dispatch: Dispatch<PodcastAction>;
}

// Створіть контекст
const PodcastContext = createContext<PodcastContextProps | undefined>(undefined);

export const usePodcastContext = () => {
    const context = useContext(PodcastContext);
    if (!context) {
        throw new Error("usePodcastContext must be used within an PodcastProvider");
    }
    return context;
};

export default PodcastContext;
