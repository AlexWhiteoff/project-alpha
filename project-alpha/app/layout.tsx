"use client";

import type { Metadata } from "next";
import "@/app/ui/globals.css";
import SideNav from "@/app/ui/Aside/SideNav";
import { inter } from "@/app/ui/fonts";
import Player from "@/app/ui/Player/Player";
import { useEffect, useRef, useState } from "react";
import AudioRefContext from "@/app/utils/context/audioContext";
import PodcastProvider from "@/app/utils/provider/podcastProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <PodcastProvider>
            <AudioRefContext.Provider value={{ audioRef }}>
                <html lang="en">
                    <body className={`${inter.className} antialised flex flex-col h-screen overflow-hidden`}>
                        <audio ref={audioRef} hidden preload="auto" />
                        <div className="flex h-screen flex-col-reverse md:flex-row md:overflow-hidden">
                            <div className="w-full flex-none md:w-64">
                                <SideNav />
                            </div>
                            <div className="flex-grow px-6 mt-4 overflow-y-auto md:px-12">{children}</div>
                        </div>
                        <div className="w-full hidden b-0 md:block px-2 py-4">
                            <Player />
                        </div>
                    </body>
                </html>
            </AudioRefContext.Provider>
        </PodcastProvider>
    );
}
