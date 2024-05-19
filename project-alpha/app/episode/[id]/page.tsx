import { fetchEpisode } from "@/app/lib/data";
import PlayButton from "@/app/ui/playButton";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [episode] = await Promise.all([fetchEpisode(id)]);

    if (!episode) {
        notFound();
    }

    return (
        <main className="flex flex-col gap-6">
            <div className="flex flex-row gap-4">
                <div className="w-32 md:w-32 lg:w-48 flex shrink-0 justify-center items-center overflow-hidden rounded">
                    <Image src={episode.image} alt={episode.title} width={200} height={200} />
                </div>
                <div className="w-full flex flex-col justify-end">
                    <div className="text-sm">Podcast Episode</div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-950">{episode.title}</h1>
                    <div className="text-sm text-gray-950 font-bold">{episode.release_date}</div>
                    <div className="p-2">
                        <PlayButton episode={episode} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row-reverse gap-6">
                <div className="flex flex-col xl:flex-[1]">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-950">Description</h1>
                    <div>{episode.description}</div>
                </div>
            </div>
        </main>
    );
}
