"use client"

import { ReactNode, useReducer } from "react";
import PodcastContext, { PodcastState } from "@/app/utils/context/podcastContext";
import { podcastReducer } from "@/app/utils/reducer/podcastReducer";

// Початковий стан
const initialState: PodcastState = {
    currentEpisode: null,
};

// Провайдер
const PodcastProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(podcastReducer, initialState);

    return <PodcastContext.Provider value={{ state, dispatch }}>{children}</PodcastContext.Provider>;
};

export default PodcastProvider;
