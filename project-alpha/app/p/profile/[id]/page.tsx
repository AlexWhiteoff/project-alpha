import { getSession } from "@/app/lib/actions/session";
import { getUserBookmarks, getUserById } from "@/app/lib/data";
import { Bookmarks } from "@/app/lib/definitions";
import Bookmark from "@/app/ui/bookmarks";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;

    const user = await getUserById(id);

    if (!user)
        return {
            title: "Not Found",
        };

    return {
        title: `Профіль користувача • ${user.username}`,
    };
}

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams?: {
        query?: string;
        list?: string;
        sort_by?: string;
        order?: string;
    };
}) {
    const id = params.id;
    const query = searchParams?.query || "";
    const list_type = (searchParams?.list || "listening") as Bookmarks["list_type"] | "all";
    const sort_by = searchParams?.sort_by || null;
    const order = searchParams?.order || null;
    const [user, session] = await Promise.all([getUserById(id), getSession()]);

    if (!user || !session) {
        notFound();
    }

    const isAuthorized = user.id === session.userId || session.role === "admin";

    const userInfo = [
        {
            label: "Дата створення",
            value: format(user.created_at, "MM/dd/yyyy"),
        },
        {
            label: "Дата народження",
            value: format(user.birthday_date, "MM/dd/yyyy"),
        },
        {
            label: "Ґендер/стать",
            value:
                user.gender === "male"
                    ? "Чоловіча"
                    : user.gender === "female"
                    ? "Жіноча"
                    : user.gender === "non_binary"
                    ? "Небінарна особа"
                    : user.gender === "something_else"
                    ? "Щось інше"
                    : user.gender === "prefer_not_to_say"
                    ? "Віддаю перевагу не називати"
                    : "Інше",
        },
    ];

    const bookmarks =
        (await getUserBookmarks(
            user.id,
            list_type !== "all" ? (list_type as Bookmarks["list_type"]) : null,
            query,
            sort_by ? (sort_by as "title" | "updated_at" | "created_at" | "bookmark_updated_at") : undefined,
            order ? (order as "ASC" | "DESC") : undefined
        )) || [];

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                {user.banner_url && (
                    <div className="flex items-center justify-center w-full h-[200px] lg:h-[350px]">
                        <Image
                            alt="user banner image"
                            src={`/assets/users/${user.id}/${user.banner_url}`}
                            width={1168}
                            height={350}
                            draggable={false}
                            className="object-cover h-full"
                        />
                    </div>
                )}
                <div className="-translate-y-1/4 flex flex-col items-center py-2 mx-8 md:mx-0 backdrop-blur bg-neutral-800/50 rounded-lg md:translate-y-0">
                    <div className="flex items-center justify-center md:justify-between w-full px-4">
                        <div className="-translate-y-1/4 flex gap-4 items-center flex-col md:flex-row md:translate-y-0 ">
                            <div className="flex items-center justify-center overflow-hidden border-2 border-gray-950 w-[90px] h-[90px] rounded-full md:border-0 md:rounded-none md:w-[50px] md:h-[50px]">
                                <Image
                                    src={
                                        user.avatar_url
                                            ? `/assets/users/${user.id}/${user.avatar_url}`
                                            : "/assets/users/placeholder_avatar.jpg"
                                    }
                                    alt="user avatar image"
                                    width={50}
                                    height={50}
                                    className="object-cover h-full w-full bg-gray-300"
                                    draggable={false}
                                />
                            </div>
                            <div className="block break-all text-gray-100 text-lg font-bold">{user.username}</div>
                        </div>
                        {isAuthorized && (
                            <div className="hidden md:block">
                                <Link
                                    href={`/p/profile/${user.id}/settings`}
                                    className={
                                        "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                    }
                                >
                                    <Cog6ToothIcon className="w-6" />
                                    <p>Налаштування</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex w-full justify-center md:justify-end border-t border-blue-600 pt-2 px-4 md:mt-4">
                        {userInfo.map((item) => (
                            <div className="px-4 py-2" key={item.label}>
                                <div className="text-neutral-400 text-xs md:text-sm font-medium">{item.label}</div>
                                <div className="text-gray-100 text-sm font-medium">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                    <Bookmark
                        title={`Закладки користувача ${user.username}`}
                        bookmarks={bookmarks}
                        currList={list_type}
                        currSort={sort_by as "title" | "updated_at" | "created_at" | "bookmark_updated_at"}
                        currOrder={order as "ASC" | "DESC"}
                    />
                </div>
            </div>
        </main>
    );
}
