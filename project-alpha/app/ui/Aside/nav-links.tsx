"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
    HomeIcon as outlineHomeIcon,
    Square3Stack3DIcon as outlineSquare3Stack3DIcon,
    BookmarkIcon as outlineBookmarkIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";
import {
    HomeIcon as solidHomeIcon,
    Square3Stack3DIcon as solidSquare3Stack3DIcon,
    BookmarkIcon as solidBookmarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import UserProfile from "@/app/ui/Aside/User";
import styles from "@/app/ui/styles/animation.module.css";

const links = [
    {
        name: "Головна",
        href: "/p",
        iconOutline: outlineHomeIcon,
        iconSolid: solidHomeIcon,
    },
    {
        name: "Каталог",
        href: "/p/catalog",
        iconOutline: outlineSquare3Stack3DIcon,
        iconSolid: solidSquare3Stack3DIcon,
    },
    {
        name: "Закладки",
        href: "/p/bookmarks",
        iconOutline: outlineBookmarkIcon,
        iconSolid: solidBookmarkIcon,
    },
];

export default function NavLinks() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileMenuAnimate, setIsMobileMenuAnimate] = useState(false);

    const handleMobileMenuClick = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuAnimate(true);
            setTimeout(() => {
                setIsMobileMenuOpen(false);
                setIsMobileMenuAnimate(false);
            }, 300);
        } else {
            setIsMobileMenuOpen((prevState) => !prevState);
        }
    };

    const MobileMenu = () => {
        return (
            <div className="md:hidden">
                <div
                    className={clsx(
                        "fixed z-30 top-0 right-0 w-[75%] h-full bg-neutral-800 border-l border-blue-600",
                        isMobileMenuOpen && styles.menu_open,
                        isMobileMenuAnimate && styles.menu_close
                    )}
                >
                    <UserProfile />
                </div>
                <div
                    className="fixed transition-all z-10 top-0 left-0 w-full h-full bg-gray-950/0"
                    onClick={handleMobileMenuClick}
                />
            </div>
        );
    };

    return (
        <>
            <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <div className="flex w-full gap-2 md:flex-col">
                    {links.map((link) => {
                        const LinkIcon = pathname === link.href ? link.iconSolid : link.iconOutline;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "flex transition-all h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-950 p-3 text-sm font-medium hover:bg-neutral-900  md:flex-none md:justify-start md:p-2 md:px-3",
                                    {
                                        "bg-neutral-900 text-blue-400 hover:bg-neutral-900": pathname === link.href,
                                    }
                                )}
                            >
                                <LinkIcon className="w-6" />
                                <p className="hidden md:block">{link.name}</p>
                            </Link>
                        );
                    })}
                    <button
                        type="button"
                        className={
                            "flex md:hidden h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-950 p-3 hover:bg-neutral-900"
                        }
                        onClick={handleMobileMenuClick}
                    >
                        <Bars3Icon className="w-6" />
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && <MobileMenu />}
        </>
    );
}
