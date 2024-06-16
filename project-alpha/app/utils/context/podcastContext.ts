import { createContext, Dispatch, useContext } from "react";
import { ExtendedEpisode } from "@/app/lib/definitions";

export interface PodcastState {
    episode: ExtendedEpisode | null;
}

export type PodcastAction = { type: "SET_EPISODE"; payload: ExtendedEpisode } | { type: "CLEAR_EPISODE" };

interface PodcastContextProps {
    state: PodcastState;
    dispatch: Dispatch<PodcastAction>;
}

const PodcastContext = createContext<PodcastContextProps | undefined>(undefined);

export const usePodcastContext = () => {
    const context = useContext(PodcastContext);
    if (!context) {
        throw new Error("usePodcastContext must be used within an PodcastProvider");
    }
    return context;
};

export default PodcastContext;
