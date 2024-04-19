"use client";

import type { Metadata } from "next";
import "@/app/ui/globals.css";
import SideNav from "@/app/ui/Aside/SideNav";
import { inter } from "@/app/ui/fonts";
import Player from "@/app/ui/Player";
import { useEffect, useRef, useState } from "react";
import PlayerContext from "./context/audioContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currTrack, setCurrTrack] = useState<any>({});

    const playAudio = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currTrack.src;
            playAudio();
        }
    }, [currTrack]);

    return (
        <html lang="en">
            <body className={`${inter.className} antialised flex flex-col h-screen overflow-hidden`}>
                <PlayerContext.Provider value={{ isPlaying, playAudio, pauseAudio, currTrack, setCurrTrack }}>
                    <div className="flex h-screen flex-col-reverse md:flex-row md:overflow-hidden">
                        <div className="w-full flex-none md:w-64">
                            <SideNav />
                        </div>
                        <div className="flex-grow px-6 mt-4 overflow-y-auto md:px-12">{children}</div>
                    </div>
                    <div className="w-full absolute md:relative px-2 py-4">
                        <Player />
                    </div>
                    <audio ref={audioRef} src={`/${currTrack.src}`} preload="auto" />
                </PlayerContext.Provider>
            </body>
        </html>
    );
}
