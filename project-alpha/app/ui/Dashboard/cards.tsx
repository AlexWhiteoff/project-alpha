import {
    ClockIcon,
    InboxIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { fetchEpisodesCardData, fetchPodcastCardData, fetchUsersCardData } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
    podcasts: InboxIcon,
    pending: ClockIcon,
    active: CheckCircleIcon,
    inactive: XCircleIcon,
    users: UserGroupIcon,
    admin: ShieldCheckIcon,
    creator: MusicalNoteIcon,
};

export async function PodcastCardWrapper() {
    const { podcastCount, podcastPendingCount, podcastActiveCount, podcastInactiveCount } =
        await fetchPodcastCardData();

    return (
        <>
            <Card title="Подкастів" value={podcastCount} type="podcasts" />
            <Card title="В очікуванні" value={podcastPendingCount} type="pending" />
            <Card title="Активних" value={podcastActiveCount} type="active" />
            <Card title="Неактивних" value={podcastInactiveCount} type="inactive" />
        </>
    );
}

export async function EpisodesCardWrapper() {
    const { episodeCount, episodeLastMonth, episodeActiveCount, episodeInactiveCount } = await fetchEpisodesCardData();

    return (
        <>
            <Card title="Епізодів" value={episodeCount} type="podcasts" />
            <Card title="За останній місяць" value={episodeLastMonth} type="pending" />
            <Card title="Активних" value={episodeActiveCount} type="active" />
            <Card title="Неактивних" value={episodeInactiveCount} type="inactive" />
        </>
    );
}

export async function UsersCardWrapper() {
    const { userCount, userLastMonth, userAdmins, userCreators } = await fetchUsersCardData();

    return (
        <>
            <Card title="Користувачів" value={userCount} type="users" />
            <Card title="За останній місяць" value={userLastMonth} type="pending" />
            <Card title="Адміністраторів" value={userAdmins} type="admin" />
            <Card title="Творців" value={userCreators} type="creator" />
        </>
    );
}

function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: "podcasts" | "pending" | "active" | "inactive" | "users" | "admin" | "creator";
}) {
    const Icon = iconMap[type];

    return (
        <div className="flex flex-col justify-between rounded-xl bg-neutral-900 p-2 shadow-sm">
            <div className="flex p-4 shrink-0">
                {Icon ? <Icon className="h-5 w-5 text-neutral-300 shrink-0" /> : null}
                <h3 className="mx-2 text-sm font-medium text-white">{title}</h3>
            </div>
            <p className={`${lusitana.className} truncate rounded-xl bg-neutral-700 px-4 py-8 text-center text-2xl`}>
                {value}
            </p>
        </div>
    );
}
