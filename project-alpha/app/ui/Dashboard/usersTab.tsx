import { UsersCardWrapper } from "@/app/ui/Dashboard/cards";
import Search from "@/app/ui//search";
import { UserTable } from "@/app/ui/Dashboard/tables";
import Pagination from "./pagination";
import { fetchUsersPages } from "@/app/lib/data";

export default async function UsersTab({ query, currentPage }: { query: string; currentPage: number }) {
    const totalPages = await fetchUsersPages(query);

    return (
        <div className="w-full relative">
            <div className="flex flex-row items-center justify-center">
                <div className="grid gap-6 grid-cols-2 xl:grid-cols-4">
                    <UsersCardWrapper />
                </div>
            </div>
            <div className="flex flex-col w-full ">
                <div className="mt-4 flex items-center justify-between md:mt-8">
                    <Search placeholder="Пошук користувачів..." />
                </div>
                <UserTable query={query} currentPage={currentPage} />
                <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages} />
                </div>
            </div>
        </div>
    );
}
