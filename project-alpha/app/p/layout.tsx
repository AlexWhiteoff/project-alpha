"use client";

import SideNav from "@/app/ui/Aside/SideNav";
import Player from "@/app/ui/Player/Player";
import { useRef } from "react";
import AudioRefContext from "@/app/utils/context/audioContext";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <>
            <AudioRefContext.Provider value={{ audioRef }}>
                <audio ref={audioRef} hidden preload="auto" />
                <div className="flex h-screen flex-col-reverse md:flex-row md:overflow-hidden">
                    <div className="w-full flex-none md:w-64">
                        <SideNav />
                    </div>
                    <div className="flex-grow md:px-6 md:py-4 overflow-y-auto md:px-12">{children}</div>
                </div>
                <div className="fixed w-full hidden bottom-0 left-0 md:block px-2 py-4">
                    <Player />
                </div>
            </AudioRefContext.Provider>
        </>
    );
}
