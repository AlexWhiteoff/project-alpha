import Search from "@/app/ui/search";
import { CreateEpisode } from "@/app/ui/buttons";
import { EpisodeTable } from "@/app/lib/definitions";
import EpisodeList from "@/app/ui/Episodes/EpisodeList";

export default function EpisodesTab({ podcastId, episodes }: { podcastId: string; episodes: EpisodeTable[] }) {
    return (
        <div className="w-full">
            <div className="mt-4 flex items-center justify-between gap-2">
                <Search placeholder="Пошук епізодів..." />
                <CreateEpisode podcastId={podcastId} />
            </div>
            <div className="mt-6">
                <EpisodeList episodes={episodes} />
            </div>
        </div>
    );
}
