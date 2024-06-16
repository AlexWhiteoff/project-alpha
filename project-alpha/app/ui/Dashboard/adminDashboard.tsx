import {
    SignalIcon as outlineSignalIcon,
    Squares2X2Icon as outlineSquares2X2Icon,
    UserGroupIcon as outlineUserGroupIcon,
} from "@heroicons/react/24/outline";
import {
    SignalIcon as solidSignalIcon,
    Squares2X2Icon as solidSquares2X2Icon,
    UserGroupIcon as solidUserGroupIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";
import PodcastsTab from "@/app/ui/Dashboard/podcastsTab";
import EpisodesTab from "@/app/ui/Dashboard/episodesTab";
import UsersTab from "@/app/ui/Dashboard/usersTab";

const tabs = [
    {
        label: "Подкасти",
        href: "podcasts",
        icon: { solid: solidSignalIcon, outline: outlineSignalIcon },
        Component: PodcastsTab,
    },
    {
        label: "Епізоди",
        href: "episodes",
        icon: { solid: solidSquares2X2Icon, outline: outlineSquares2X2Icon },
        Component: EpisodesTab,
    },
    {
        label: "Користувачі",
        href: "users",
        icon: { solid: solidUserGroupIcon, outline: outlineUserGroupIcon },
        Component: UsersTab,
    },
];

export default async function AdminDashboard({
    currTab,
    query,
    currentPage,
}: {
    currTab: string;
    query: string;
    currentPage: number;
}) {
    const tabObject = tabs.find((tab) => tab.href === currTab);
    const TabComponent = tabObject ? tabObject.Component : tabs[0].Component;

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col max-w-[1200px] w-full md:rounded-lg overflow-x-hidden">
                <div className="hidden md:flex flex-row justify-between items-center px-6 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold">Панель управління</h1>
                </div>
                <div className="flex md:hidden flex-row justify-between items-center px-6 py-3 bg-neutral-800 rounded-lg">
                    <h1 className="md:text-xl lg:text-2xl xl:text-3xl font-medium">
                        Панель управління - {tabObject?.label || tabs[0].label}
                    </h1>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex lg:bg-neutral-800 transition-all flex-row lg:flex-col shrink-0 gap-2 mx-4 md:mx-0 md:w-full h-fit lg:w-1/4 py-4 rounded-lg overflow-y-hidden justify-between ">
                        {tabs.map((tab) => {
                            const isTabActive = currTab === tab.href;
                            const Icon = isTabActive ? tab.icon.solid : tab.icon.outline;
                            return (
                                <Link
                                    key={tab.href}
                                    href={`/p/dashboard?tab=${tab.href}`}
                                    className={clsx(
                                        "transition-all flex grow items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer",
                                        isTabActive ? "text-white" : "text-neutral-300"
                                    )}
                                >
                                    <Icon className="flex w-6 lg:w-5 shrink-0" />
                                    <span className="hidden md:inline-block text-sm">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="w-full h-fit lg:w-3/4 py-4 px-4 md:pr-8 lg:bg-neutral-800 rounded-lg">
                        <TabComponent query={query} currentPage={currentPage} />
                    </div>
                </div>
            </div>
        </main>
    );
}
