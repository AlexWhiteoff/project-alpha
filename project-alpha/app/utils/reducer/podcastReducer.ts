import { PodcastAction, PodcastState } from "@/app/utils/context/podcastContext";

export function podcastReducer(state: PodcastState, action: PodcastAction): PodcastState {
    switch (action.type) {
        case "SET_EPISODE":
            return {
                ...state,
                episode: action.payload,
            };
        case "CLEAR_EPISODE":
            return {
                ...state,
                episode: null,
            };
        default:
            return state;
    }
}
