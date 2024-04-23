import { PodcastAction, PodcastState } from "@/app/utils/context/podcastContext";

export function podcastReducer(state: PodcastState, action: PodcastAction): PodcastState {
    switch (action.type) {
        case "SET_EPISODE":
            return {
                ...state,
                currentEpisode: action.payload,
            };
        case "CLEAR_EPISODE":
            return {
                ...state,
                currentEpisode: null,
            };
        default:
            return state;
    }
}
