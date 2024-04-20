import React from "react";
import NavLinks from "@/app/ui/Aside/nav-links";
import UserProfile from "./User";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="mb-2 flex items-center justify-between rounded-md bg-gray-950 p-4">
                <div className="block md:hidden">
                    <Bars3Icon className="w-[40px] text-gray-50" />
                </div>
                <div className="block md:hidden">
                    <Image src="/dark_logo_without_text_transparent.png" alt="logo image" width={40} height={40} />
                </div>
                <UserProfile />
            </div>
            <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
            </div>
        </div>
    );
}
