"use client";

import { signOut } from "@/app/lib/actions/auth";
import { getSession } from "@/app/lib/actions/session";
import { SessionPayload } from "@/app/lib/definitions";
import { ChartBarSquareIcon, Cog6ToothIcon, PlusIcon, PowerIcon, UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "@/app/ui/styles/animation.module.css";
import { redirect } from "next/navigation";

export default function UserProfile() {
    const [user, setUser] = useState<SessionPayload>({} as SessionPayload);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        {
            name: "Профіль",
            href: "/p/profile/" + user?.userId,
            icon: UserIcon,
        },
        {
            name: "Налаштування",
            href: `/p/profile/${user?.userId}/settings`,
            icon: Cog6ToothIcon,
        },
    ];

    useEffect(() => {
        const getUserFromSession = async () => {
            const session = await getSession();

            if (!session) {
                redirect("/");
            }

            setUser(session);
        };

        getUserFromSession();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    return (
        <>
            <div className="flex md:hidden flex-col justify-center items-center w-full py-3">
                <div className="flex flex-col w-full md:flex-row items-center gap-3 p-4">
                    <div className="w-[60px] h-[60px] bg-gray-300 rounded-full overflow-hidden">
                        <Image
                            src={
                                user.avatar_url
                                    ? `/assets/users/${user.userId}/${user.avatar_url}`
                                    : "/assets/users/placeholder_avatar.jpg"
                            }
                            alt="user avatar image"
                            width={60}
                            height={60}
                            draggable={false}
                        />
                    </div>
                    <div className="block break-all text-gray-100 text-lg">{user.name}</div>

                    <div className="flex w-full flex-col gap-2 p-2 mt-2 rounded-md overflow-hidden">
                        {links.map((link) => {
                            const LinkIcon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={
                                        "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                    }
                                >
                                    <LinkIcon className="w-6" />
                                    <p>{link.name}</p>
                                </Link>
                            );
                        })}
                        {user?.role === "admin" || user?.role === "content_creator" ? (
                            <>
                                <hr className="my-2 border-neutral-500" />
                                <Link
                                    href="/p/podcast/create"
                                    className={
                                        "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                    }
                                >
                                    <PlusIcon className="w-6" />
                                    <p>Додати Подкаст</p>
                                </Link>
                            </>
                        ) : null}
                        {user?.role === "admin" && (
                            <Link
                                href="/p/dashboard"
                                className={
                                    "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                }
                            >
                                <ChartBarSquareIcon className="w-6" />
                                <p>Панель Управління</p>
                            </Link>
                        )}
                        <hr className="my-2 border-neutral-500" />
                        <form action={() => signOut()}>
                            <button className="flex transition-all h-[48px] w-full grow items-center justify-center gap-2 rounded-md text-sm bg-red-950/50 p-3 text-red-300 font-medium hover:bg-gray-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                                <PowerIcon className="w-6" />
                                <p>Вийти</p>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden md:block relative cursor-pointer transition-all w-full">
                <div className="flex flex-row items-center gap-3 p-4" onClick={toggleMenu}>
                    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full overflow-hidden">
                        <Image
                            src={
                                user.avatar_url
                                    ? `/assets/users/${user.userId}/${user.avatar_url}`
                                    : "/assets/users/placeholder_avatar.jpg"
                            }
                            alt="user avatar image"
                            width={40}
                            height={40}
                        />
                    </div>
                    <div className="block break-all text-gray-100 text-lg">{user?.name}</div>
                </div>
                <div>
                    {isMenuOpen && (
                        <div
                            className={clsx(
                                "flex flex-col p-2 mt-2 rounded-md overflow-hidden",
                                isMenuOpen ? styles.dropdown_open : styles.dropdown_close
                            )}
                        >
                            {links.map((link) => {
                                const LinkIcon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={
                                            "flex transition-all h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                        }
                                    >
                                        <LinkIcon className="w-6" />
                                        <p className="hidden md:block">{link.name}</p>
                                    </Link>
                                );
                            })}
                            {user.role === "admin" || user?.role === "content_creator" ? (
                                <>
                                    <hr className="my-2 border-neutral-500" />
                                    <Link
                                        href="/p/podcast/create"
                                        className={
                                            "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                        }
                                    >
                                        <PlusIcon className="w-6" />
                                        <p>Додати Подкаст</p>
                                    </Link>
                                </>
                            ) : null}
                            {user.role === "admin" && (
                                <Link
                                    href="/p/dashboard"
                                    className={
                                        "flex transition-all h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                    }
                                >
                                    <ChartBarSquareIcon className="w-6" />
                                    <p className="hidden md:block">Панель Управління</p>
                                </Link>
                            )}
                            <hr className="my-2 border-neutral-500" />
                            <form action={() => signOut()}>
                                <button className="flex transition-all h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-950 p-3 text-sm font-medium hover:bg-grey-100 hover:text-blue-400 md:flex-none md:justify-start md:p-2 md:px-3">
                                    <PowerIcon className="w-6" />
                                    <div className="hidden md:block">Вийти</div>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
