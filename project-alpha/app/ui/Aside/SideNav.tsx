import React, { useEffect } from "react";
import NavLinks from "@/app/ui/Aside/nav-links";
import UserProfile from "./User";
import { Bars3Icon, PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/app/lib/actions/auth";
import { getSession } from "@/app/lib/actions/session";

export default function SideNav() {
    useEffect(() => {}, []);

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
            <form action={() => signOut()}>
                <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-950 p-3 text-sm font-medium hover:bg-grey-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <PowerIcon className="w-6" />
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </form>
        </div>
    );
}
