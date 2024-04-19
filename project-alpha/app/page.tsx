"use client";

import { useEffect, useRef, useState } from "react";
import { fetchTracks } from "./lib/data";
import { useAudioPlayer } from "./context/audioContext";
// import AudioPlayer from "./ui/Player/Player";

export default function Home() {
    const [trackList, setTrackList] = useState<any>([]);
    const { setCurrTrack } = useAudioPlayer();

    useEffect(() => {
        const getTracks = async () => {
            const data = await fetchTracks();
            console.log(data);

            setTrackList(data);
        };

        getTracks();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-900">Welcome to Project Alpha!</h1>
            <div className="flex flex-wrap gap-2">
                {trackList.map((track: any) => (
                    <div className="" key={track.id} onClick={() => setCurrTrack(track)}>
                        <div className="text-grey-50">{track.title}</div>
                        <div className="text-grey-300">{track.author}</div>
                    </div>
                ))}
            </div>
        </main>
    );
}
