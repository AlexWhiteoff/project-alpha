"use client";

import { useEffect, useState } from "react";
import { fetchEpisodes } from "@/app/lib/data";
import { Episode } from "@/app/lib/definitions";
import usePlayer from "@/app/utils/hooks/usePlayer";

export default function Home() {
    const [episodeList, setEpisodeList] = useState<Episode[]>([]);
    const { setEpisode } = usePlayer();

    useEffect(() => {
        const getEpisodeList = async () => {
            const data = await fetchEpisodes();

            setEpisodeList(data);
        };

        getEpisodeList();
    }, []);

    const handleClick = (episode: Episode) => {
        setEpisode(episode);
    };

    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome to Project Alpha!</h1>
            <div className="flex flex-wrap gap-2">
                {episodeList.map((episode: Episode) => (
                    <button className="" key={episode.id} onClick={() => handleClick(episode)}>
                        <div className="text-grey-50">{episode.title}</div>
                    </button>
                ))}
            </div>
        </main>
    );
}
