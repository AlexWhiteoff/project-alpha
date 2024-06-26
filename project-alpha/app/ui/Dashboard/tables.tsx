import { fetchEpisodesTable, fetchPodcastsTable, fetchUsersTable } from "@/app/lib/data";
import Image from "next/image";
import { formatDateToLocal } from "@/app/ui/utils";
import { DeleteEpisode, DeletePodcast, DeleteUser, EditPodcast, UpdateEpisode, UpdateUser } from "@/app/ui/buttons";
import PodcastStatus from "./status";
import Link from "next/link";

const genders = [
    {
        name: "Чоловіча",
        value: "male",
    },
    {
        name: "Жіноча",
        value: "female",
    },
    {
        name: "Небінарна особа",
        value: "non_binary",
    },
    {
        name: "Щось інше",
        value: "something_else",
    },
    {
        name: "Віддаю перевагу не називати",
        value: "prefer_not_to_say",
    },
    {
        name: "Інше",
        value: "other",
    },
];

const roles = [
    { name: "Користувач", value: "user" },
    { name: "Творець контенту", value: "content_creator" },
    { name: "Адміністратор", value: "admin" },
];

export async function PodcastTable({ query, currentPage }: { query: string; currentPage: number }) {
    const podcasts = await fetchPodcastsTable(query, currentPage);

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md p-2 md:pt-0">
                            <div className="md:hidden">
                                {podcasts?.map((podcast) => (
                                    <div key={podcast.id} className="mb-2 w-full rounded-md bg-neutral-800 p-4">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center">
                                                    <Image
                                                        src={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                                                        className="mr-2 rounded-full"
                                                        width={50}
                                                        height={50}
                                                        alt={`${podcast.title} podcast picture`}
                                                    />
                                                    <Link href={`/p/podcast/${podcast.id}`}>
                                                        <p>{podcast.title}</p>
                                                        <p className="text-sm text-neutral-400">
                                                            {podcast.author_name}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </div>
                                            <PodcastStatus status={podcast.status} is_active={podcast.is_active} />
                                        </div>
                                        <div className="flex w-full items-center justify-between pt-4">
                                            <div className="flex w-full items-center justify-between border-b py-5">
                                                <div className="flex w-1/4 flex-col">
                                                    <p className="text-xs">Змінено</p>
                                                    <p className="font-medium">
                                                        {formatDateToLocal(podcast.updated_at)}
                                                    </p>
                                                </div>
                                                <div className="flex w-1/4 flex-col">
                                                    <p className="text-xs">Створено</p>
                                                    <p className="font-medium">
                                                        {formatDateToLocal(podcast.created_at)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <EditPodcast id={podcast.id} />
                                                    <DeletePodcast id={podcast.id} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 text-sm">
                                            <p>{podcast.total_episodes} Епізодів</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <table className="hidden min-w-full rounded-md text-neutral-300 md:table">
                                <thead className="rounded-md text-left text-sm font-normal border-b border-neutral-600">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Назва
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Автор
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Епізодів
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Змінено
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Створено
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Статус
                                        </th>
                                        <th scope="col" className="relative py-3 pl-6 pr-3">
                                            <span className="sr-only">Редагування</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-600 text-neutral-200">
                                    {podcasts.map((podcast) => (
                                        <tr key={podcast.id} className="group hover:bg-neutral-700">
                                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-white sm:pl-6">
                                                <Link
                                                    href={`/p/podcast/${podcast.id}`}
                                                    className="flex items-center gap-3 shrink-0 pr-[50px]"
                                                >
                                                    <Image
                                                        src={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                                                        className="rounded-lg"
                                                        alt={`${podcast.title} podcast picture`}
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <p>{podcast.title}</p>
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <Link href={`/p/profile/${podcast.author_id}`}>
                                                    {podcast.author_name}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {podcast.total_episodes}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(podcast.updated_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(podcast.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <PodcastStatus status={podcast.status} is_active={podcast.is_active} />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <div className="flex justify-end gap-3">
                                                    <EditPodcast id={podcast.id} />
                                                    <DeletePodcast id={podcast.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function EpisodeTable({ query, currentPage }: { query: string; currentPage: number }) {
    const episodes = await fetchEpisodesTable(query, currentPage);

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-md p-2 md:pt-0">
                            <div className="md:hidden">
                                {episodes?.map((episode) => (
                                    <div key={episode.id} className="mb-2 w-full rounded-md bg-neutral-800 p-4">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="relative mb-2 flex items-center">
                                                    <div
                                                        className={`absolute top-0 left-0 z-10 h-3 w-3 rounded-full ${
                                                            episode.is_active ? "bg-green-500" : "bg-red-500"
                                                        }`}
                                                    ></div>
                                                    <Image
                                                        src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                                        className="mr-2 rounded-full aspect-square"
                                                        width={50}
                                                        height={50}
                                                        alt={`${episode.title} episode picture`}
                                                    />
                                                    <Link href={`/p/episode/${episode.id}`}>
                                                        <p>{episode.title}</p>
                                                        <p className="text-sm text-neutral-400">
                                                            {episode.author_name}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between pt-4">
                                            <div className="flex w-full items-center justify-between border-b pb-4">
                                                <div className="flex w-2/4 flex-col">
                                                    <p className="text-xs">Подкаст</p>
                                                    <Link
                                                        href={`/p/podcast/${episode.podcast_id}`}
                                                        className="font-medium"
                                                    >
                                                        {episode.podcast_title}
                                                    </Link>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-xs">Статус</p>
                                                    <PodcastStatus
                                                        status={episode.status}
                                                        is_active={episode.podcast_is_active}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between pt-4">
                                            <div className="flex w-1/4 flex-col">
                                                <p className="text-xs">Змінено</p>
                                                <p className="font-medium">{formatDateToLocal(episode.updated_at)}</p>
                                            </div>
                                            <div className="flex w-1/4 flex-col">
                                                <p className="text-xs">Створено</p>
                                                <p className="font-medium">{formatDateToLocal(episode.created_at)}</p>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <UpdateEpisode id={episode.id} />
                                                <DeleteEpisode id={episode.id} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <table className="hidden min-w-full rounded-md text-neutral-300 md:table">
                                <thead className="rounded-md text-left text-sm font-normal border-b border-neutral-600">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Назва
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Подкаст
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Автор
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Змінено
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Створено
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Статус подкасту
                                        </th>
                                        <th scope="col" className="relative py-3 pl-6 pr-3">
                                            <span className="sr-only">Редагування</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-600 text-neutral-200">
                                    {episodes.map((episode) => (
                                        <tr key={episode.id} className="group hover:bg-neutral-700">
                                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-white sm:pl-6">
                                                <Link
                                                    href={`/p/episode/${episode.id}`}
                                                    className="relative flex items-center gap-3 shrink-0"
                                                >
                                                    <div
                                                        className={`absolute top-0 -translate-y-1/3 -translate-x-1/3 left-0 z-10 h-3 w-3 rounded-full ${
                                                            episode.is_active ? "bg-green-500" : "bg-red-500"
                                                        }`}
                                                    ></div>
                                                    <Image
                                                        src={`/assets/podcasts/${episode.podcast_id}/${episode.id}/${episode.image_url}`}
                                                        className="rounded-lg aspect-square"
                                                        alt={`${episode.title} episode picture`}
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <p className="max-w-48 text-ellipsis overflow-hidden">
                                                        {episode.title}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <Link href={`/p/podcast/${episode.podcast_id}`}>
                                                    {episode.podcast_title}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <Link href={`/p/profile/${episode.author_id}`}>
                                                    {episode.author_name}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(episode.updated_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(episode.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <PodcastStatus
                                                    status={episode.status}
                                                    is_active={episode.podcast_is_active}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <div className="flex justify-end gap-3">
                                                    <UpdateEpisode id={episode.id} />
                                                    <DeleteEpisode id={episode.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function UserTable({ query, currentPage }: { query: string; currentPage: number }) {
    const users = await fetchUsersTable(query, currentPage);

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-md p-2 md:pt-0">
                            <div className="md:hidden">
                                {users?.map((usr) => (
                                    <div key={usr.id} className="mb-2 w-full rounded-md bg-neutral-800 p-4">
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center">
                                                    <Image
                                                        src={
                                                            usr.avatar_url
                                                                ? `/assets/users/${usr.id}/${usr.avatar_url}`
                                                                : "/assets/users/placeholder_avatar.jpg"
                                                        }
                                                        className="mr-2 rounded-full"
                                                        width={50}
                                                        height={50}
                                                        alt={`${usr.username} usr picture`}
                                                    />
                                                    <Link href={`/p/usr/${usr.id}`}>
                                                        <p>{usr.username}</p>
                                                        <p className="text-sm text-neutral-400">{usr.email}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between pt-4">
                                            <div className="flex flex-col gap-3 w-full items-center justify-between border-b pb-4">
                                                <div className="flex w-full flex-row items-center justify-between">
                                                    <div className="flex w-1/2 flex-col">
                                                        <p className="text-xs">Роль</p>
                                                        {roles.find((role) => role.value === usr.role)?.name}
                                                    </div>
                                                    <div className="flex w-1/2 flex-col">
                                                        <p className="text-xs">Ґендер/Стать</p>
                                                        {genders.find((gender) => gender.value === usr.gender)?.name}
                                                    </div>
                                                </div>
                                                <div className="flex w-full flex-col">
                                                    <p className="text-xs">Дата народження</p>
                                                    <div className="font-medium">
                                                        {formatDateToLocal(usr.birthday_date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between pt-4">
                                            <div className="flex w-1/4 flex-col">
                                                <p className="text-xs">Змінено</p>
                                                <p className="font-medium">{formatDateToLocal(usr.updated_at)}</p>
                                            </div>
                                            <div className="flex w-1/4 flex-col">
                                                <p className="text-xs">Створено</p>
                                                <p className="font-medium">{formatDateToLocal(usr.created_at)}</p>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <UpdateEpisode id={usr.id} />
                                                <DeleteEpisode id={usr.id} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <table className="hidden min-w-full rounded-md text-neutral-300 md:table">
                                <thead className="rounded-md text-left text-sm font-normal border-b border-neutral-600">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Ім&apos;я
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Дата народження
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Роль
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Ґендер/Стать
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Змінено
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Створено
                                        </th>
                                        <th scope="col" className="relative py-3 pl-6 pr-3">
                                            <span className="sr-only">Редагування</span>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-600 text-neutral-200">
                                    {users.map((usr) => (
                                        <tr key={usr.id} className="group hover:bg-neutral-700">
                                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-white sm:pl-6">
                                                <Link
                                                    href={`/p/profile/${usr.id}`}
                                                    className="relative flex items-center gap-3 shrink-0"
                                                >
                                                    <Image
                                                        src={
                                                            usr.avatar_url
                                                                ? `/assets/users/${usr.id}/${usr.avatar_url}`
                                                                : "/assets/users/placeholder_avatar.jpg"
                                                        }
                                                        className="rounded-lg object-cover aspect-square"
                                                        alt={`${usr.username} user picture`}
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <p className="w-48 text-ellipsis overflow-hidden">{usr.username}</p>
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">{usr.email}</td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(usr.birthday_date)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {roles.find((role) => role.value === usr.role)?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {genders.find((gender) => gender.value === usr.gender)?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(usr.updated_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                {formatDateToLocal(usr.created_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-5 text-sm">
                                                <div className="flex justify-end gap-3">
                                                    <UpdateUser id={usr.id} />
                                                    <DeleteUser id={usr.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
