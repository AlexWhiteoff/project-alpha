import { PodcastCardWrapper } from "@/app/ui/Dashboard/cards";
import Search from "@/app/ui//search";
import { PodcastTable } from "@/app/ui/Dashboard/tables";
import { CreatePodcast } from "@/app/ui//buttons";
import Pagination from "./pagination";
import { fetchPodcastsPages } from "@/app/lib/data";

export default async function PodcastsTab({ query, currentPage }: { query: string; currentPage: number }) {
    const totalPages = await fetchPodcastsPages(query);

    return (
        <div className="w-full relative">
            <div className="flex flex-row items-center justify-center">
                <div className="grid gap-6 grid-cols-2 xl:grid-cols-4">
                    <PodcastCardWrapper />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Пошук подкастів..." />
                    <CreatePodcast />
                </div>
                <PodcastTable query={query} currentPage={currentPage} />
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
