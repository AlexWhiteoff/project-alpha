import { getSession } from "@/app/lib/actions/session";
import { getUserBookmarks } from "@/app/lib/data";
import { Bookmarks } from "@/app/lib/definitions";
import Bookmark from "@/app/ui/bookmarks";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Мої закладки",
};

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        list?: string;
        sort_by?: string;
        order?: string;
    };
}) {
    const query = searchParams?.query || "";
    const list_type = (searchParams?.list || "listening") as Bookmarks["list_type"] | "all";
    const sort_by = searchParams?.sort_by || null;
    const order = searchParams?.order || null;

    const session = await getSession();
    if (!session) {
        redirect("/");
    }

    const bookmarks =
        (await getUserBookmarks(
            session.userId,
            list_type !== "all" ? (list_type as Bookmarks["list_type"]) : null,
            query,
            sort_by ? (sort_by as "title" | "updated_at" | "created_at" | "bookmark_updated_at") : undefined,
            order ? (order as "ASC" | "DESC") : undefined
        )) || [];

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <Bookmark
                    title="Мої закладки"
                    bookmarks={bookmarks}
                    currList={list_type}
                    currSort={sort_by as "title" | "updated_at" | "created_at" | "bookmark_updated_at"}
                    currOrder={order as "ASC" | "DESC"}
                />
            </div>
        </main>
    );
}
