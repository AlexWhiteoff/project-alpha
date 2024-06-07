import Search from "@/app/ui/search";
import Table from "@/app/ui/Episodes/table";
import { CreateEpisode } from "@/app/ui/Episodes/buttons";
import { fetchEpisodesPages } from "@/app/lib/data";

export default async function EpisodesTab({
    searchParams,
    podcastId,
}: {
    searchParams?: {
        query?: string;
    };
    podcastId: string;
}) {
    const query = searchParams?.query || "";

    return (
        <div className="w-full">
            <div className="mt-4 flex items-center justify-between gap-2">
                <Search placeholder="Пошук епізодів..." />
                <CreateEpisode />
            </div>
            <div>
                <Table podcastId={podcastId} query={query} />
            </div>
        </div>
    );
}
