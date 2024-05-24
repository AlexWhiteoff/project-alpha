import { fetchEpisodes, fetchPodcast } from "@/app/lib/data";
import EpisodeList from "@/app/ui/Podcast/EpisodeList";
import usePlayer from "@/app/utils/hooks/usePlayer";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PodcastPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const [podcast, episodes] = await Promise.all([fetchPodcast(id), fetchEpisodes(id)]);

    if (!podcast) {
        notFound();
    }

    return (
        <main className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
                <div className="w-32 md:w-32 lg:w-48 flex shrink-0 justify-center items-center overflow-hidden rounded">
                    <Image src={podcast.image} alt={podcast.name} width={200} height={200} />
                </div>
                <div className="w-full">
                    <div className="text-sm">Podcast</div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-950">{podcast.name}</h1>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row-reverse gap-6">
                <div className="flex flex-col xl:flex-[1]">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-950">About</h1>
                    <div>{podcast.description}</div>
                </div>
                <div className="flex flex-col xl:flex-[2]">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-950">Episodes</h1>
                    <div>
                        <EpisodeList episodes={episodes} />
                    </div>
                </div>
            </div>
        </main>
    );
}
