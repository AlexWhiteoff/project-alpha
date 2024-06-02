import React from "react";
import NavLinks from "@/app/ui/Aside/nav-links";
import UserProfile from "./User";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function SideNav() {

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <div className="mb-2 hidden md:flex items-center justify-between rounded-md bg-gray-950">
                <div className="block md:hidden">
                    <Bars3Icon className="w-[40px]" />
                </div>
                <UserProfile />
            </div>
            <div>
                <NavLinks />
            </div>
        </div>
    );
}
