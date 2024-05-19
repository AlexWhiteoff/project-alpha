"use client";

import { useEffect, useState } from "react";
import { fetchAllPodcasts } from "@/app/lib/data";
import { Podcast } from "@/app/lib/definitions";
import Card from "@/app/ui/Card";

export default function Home() {
    const [podcastList, setPodcastList] = useState<Podcast[]>([]);

    useEffect(() => {
        const getPodcastList = async () => {
            const data = await fetchAllPodcasts();

            setPodcastList(data);
        };

        getPodcastList();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome to Project Alpha!</h1>
            <div className="flex flex-wrap gap-2">
                {podcastList.map((podcast: Podcast) => (
                    <Card podcast={podcast} key={podcast.id} />
                ))}
            </div>
        </main>
    );
}
