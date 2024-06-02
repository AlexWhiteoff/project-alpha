import { getUserById } from "@/app/lib/data";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [user] = await Promise.all([getUserById(id)]);

    if (!user) {
        notFound();
    }

    const userInfo = [
        {
            label: "Creation date",
            value: format(user.created_at, "MM/dd/yyyy"),
        },
        {
            label: "Date of birth",
            value: format(user.birthday_date, "MM/dd/yyyy"),
        },
        {
            label: "Gender",
            value:
                user.gender === "male"
                    ? "Male"
                    : user.gender === "female"
                    ? "Female"
                    : user.gender === "non_binary"
                    ? "Non-binary"
                    : user.gender === "something_else"
                    ? "Something else"
                    : user.gender === "prefer_not_to_say"
                    ? "Prefer not to say"
                    : "Other",
        },
    ];

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <div className="flex items-center justify-center w-full h-[200px] lg:h-[350px]">
                    <Image
                        alt="user banner image"
                        src={"/user/S7J1BRX4Sq3m.jpg"}
                        width={1168}
                        height={350}
                        className="object-cover h-full"
                    />
                </div>
                <div className="-translate-y-1/4 flex flex-col items-center py-2 mx-8 md:mx-0 backdrop-blur bg-neutral-800/50 rounded-lg md:translate-y-0">
                    <div className="flex items-center justify-center md:justify-between w-full px-4">
                        <div className="-translate-y-1/4 flex gap-4 items-center flex-col md:flex-row md:translate-y-0 ">
                            <div className="flex items-center justify-center overflow-hidden border-2 border-gray-950 w-[90px] h-[90px] rounded-full md:border-0 md:rounded-none md:w-[50px] md:h-[50px]">
                                <Image
                                    src={`/user/${user?.avatar_url ? user.avatar_url : "placeholder_avatar.jpg"}`}
                                    alt="user avatar image"
                                    width={50}
                                    height={50}
                                    className="object-cover h-full w-full bg-gray-300"
                                />
                            </div>
                            <div className="block break-all text-gray-100 text-lg font-bold">{user.username}</div>
                        </div>
                        <div className="hidden md:block">
                            <Link
                                href={`/p/profile/${user.id}/settings`}
                                className={
                                    "flex transition-all h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:justify-start md:p-2 md:px-3"
                                }
                            >
                                <Cog6ToothIcon className="w-6" />
                                <p>Settings</p>
                            </Link>
                        </div>
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
            </div>
        </main>
    );
}
