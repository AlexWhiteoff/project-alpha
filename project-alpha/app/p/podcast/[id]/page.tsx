import { fetchPodcast, getUserById } from "@/app/lib/data";
import EpisodeList from "@/app/ui/Podcast/EpisodeList";
import usePlayer from "@/app/utils/hooks/usePlayer";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;

    // fetch data
    const podcast = await fetchPodcast(id);

    if (!podcast)
        return {
            title: "Not Found",
        };

    const author = (await getUserById(podcast.author_id)).username;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${podcast.title} • ${author}`,
        openGraph: {
            images: [`/assets/podcast/${podcast.id}`, ...previousImages],
        },
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [podcast] = await Promise.all([fetchPodcast(id)]);

    if (!podcast) {
        notFound();
    }

    return (
        <main className="flex justify-center">
            <div className="flex flex-col gap-6 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <div className="flex">
                    <Image
                        src={`/assets/podcasts/${id}/${podcast.banner_url}`}
                        alt="{podcast banner image}"
                        width={1168}
                        height={500}
                    />
                </div>
                <div className="relative flex flex-col lg:flex-row -translate-y-14 md:-translate-y-1/4 py-2 mx-8">
                    <div className="flex grow-0 flex-col lg:w-72">
                        <div className="md:w-48 lg:w-72 overflow-hidden rounded-md">
                            <Image
                                src={`/assets/podcasts/${id}/${podcast.avatar_url}`}
                                alt={podcast.title}
                                width={288}
                                height={288}
                            />
                        </div>
                        <div className="flex flex-col xl:flex-[1]">
                            <h1 className="text-xl md:text-2xl font-bold">About</h1>
                            <div className="text-pretty text-justify">{podcast.description}</div>
                        </div>
                    </div>
                    <div className="flex grow flex-col">
                        <div className="flex flex-row gap-4">
                            <div className="w-full">
                                <div className="text-sm">Podcast</div>
                                <h1 className="text-2xl md:text-4xl font-bold">{podcast.title}</h1>
                            </div>
                        </div>
                        <div className="flex flex-col xl:flex-row-reverse gap-6">
                            <div className="flex flex-col xl:flex-[2]">
                                <h1 className="text-xl md:text-2xl font-bold">Episodes</h1>
                                <div>{/* <EpisodeList episodes={episodes} /> */}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
