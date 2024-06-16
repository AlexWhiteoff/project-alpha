import { EpisodesCardWrapper } from "@/app/ui/Dashboard/cards";
import Search from "@/app/ui//search";
import { EpisodeTable } from "@/app/ui/Dashboard/tables";
import { fetchEpisodesPages } from "@/app/lib/data";
import Pagination from "./pagination";

export default async function EpisodesTab({ query, currentPage }: { query: string; currentPage: number }) {
    const totalPages = await fetchEpisodesPages(query);

    return (
        <div className="w-full relative">
            <div className="flex flex-row items-center justify-center">
                <div className="grid gap-6 grid-cols-2 xl:grid-cols-4">
                    <EpisodesCardWrapper />
                </div>
            </div>
            <div className="flex flex-col w-full ">
                <div className="mt-4 flex items-center justify-between md:mt-8">
                    <Search placeholder="Пошук епізодів..." />
                </div>
                <EpisodeTable query={query} currentPage={currentPage} />
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
