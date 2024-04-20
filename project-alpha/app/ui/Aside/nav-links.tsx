"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";
import {
    MagnifyingGlassIcon as outlineMagnifyingGlassIcon,
    HomeIcon as outlineHomeIcon,
} from "@heroicons/react/24/outline";
import { 
    MagnifyingGlassIcon as solidMagnifyingGlassIcon, 
    HomeIcon as solidHomeIcon 
} from "@heroicons/react/24/solid";

const links = [
    {
        name: "Home",
        href: "/",
        iconOutline: outlineHomeIcon,
        iconSolid: solidHomeIcon,
    },
    {
        name: "Search",
        href: "/search",
        iconOutline: outlineMagnifyingGlassIcon,
        iconSolid: solidMagnifyingGlassIcon,
    },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => {
                const LinkIcon = pathname === link.href ? link.iconSolid : link.iconOutline;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3",
                            {
                                "bg-gray-100 text-gray-600": pathname === link.href,
                            }
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
