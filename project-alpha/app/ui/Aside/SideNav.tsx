"use client";

import React, { useEffect } from "react";
import NavLinks from "@/app/ui/Aside/nav-links";
import UserProfile from "./User";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import usePlayer from "../../utils/hooks/usePlayer";

export default function SideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="mb-2 hidden md:flex items-center justify-between rounded-md bg-gray-950 p-4">
                <div className="block md:hidden">
                    <Bars3Icon className="w-[40px] text-gray-50" />
                </div>

                <UserProfile />
            </div>
            <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
            </div>
        </div>
    );
}
