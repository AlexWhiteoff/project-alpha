import Search from "@/app/ui/search";
import { CreateEpisode } from "@/app/ui/buttons";
import { Episode, ExtendedEpisode, Podcast } from "@/app/lib/definitions";
import EpisodeList from "@/app/ui/Episodes/EpisodeList";

export default function EpisodesTab({ podcast, episodes }: { podcast: Podcast; episodes: Episode[] }) {
    const podcastEpisodes = episodes.map((episode) => ({
        ...episode,
        podcast_title: podcast.title,
        author_name: podcast.author_id,
    })) as ExtendedEpisode[];

    return (
        <div className="w-full">
            <div className="mt-4 flex items-center justify-between gap-2">
                <Search placeholder="Пошук епізодів..." />
                <CreateEpisode podcastId={podcast.id} />
            </div>
            <div className="mt-6">
                <EpisodeList episodes={podcastEpisodes} isAuth={true} />
            </div>
        </div>
    );
}
