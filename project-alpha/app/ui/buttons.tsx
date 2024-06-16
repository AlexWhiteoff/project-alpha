"use client";

import { deleteEpisode, deletePodcast, deleteUser } from "@/app/lib/actions/mainActions";
import { ExtendedEpisode } from "@/app/lib/definitions";
import usePlayer from "@/app/utils/hooks/usePlayer";
import { PencilIcon, PlusIcon, SignalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlayCircleIcon, ShareIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CreateEpisode({ podcastId }: { podcastId: string }) {
    return (
        <Link
            href={`/p/episode/create/${podcastId}`}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Додати епізод</span> <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function UpdateEpisode({ id }: { id: string }) {
    return (
        <Link
            href={`/p/episode/${id}/edit`}
            className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-blue-500"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteEpisode({ id }: { id: string }) {
    const deleteEpisodeWithId = deleteEpisode.bind(null, id);

    return (
        <form action={deleteEpisodeWithId}>
            <button className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-red-400">
                <span className="sr-only">Видалити</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}

export function CreatePodcast() {
    return (
        <Link
            href="/p/podcast/create/"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Створити Подкаст</span> <PlusIcon className="h-5 md:ml-4" />
        </Link>
    );
}

export function EditPodcast({ id }: { id: string }) {
    return (
        <Link
            href={`/p/podcast/${id}/settings`}
            className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-blue-500"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeletePodcast({ id }: { id: string }) {
    const deletePodcastWithId = deletePodcast.bind(null, id);

    return (
        <form action={deletePodcastWithId}>
            <button className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-red-400">
                <span className="sr-only">Видалити</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}

export function UpdateUser({ id }: { id: string }) {
    return (
        <Link
            href={`/p/profile/${id}/settings`}
            className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-blue-500"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}

export function DeleteUser({ id }: { id: string }) {
    const deleteUserWithId = deleteUser.bind(null, id);

    return (
        <form action={deleteUserWithId}>
            <button className="transition-colors rounded-md border p-2 hover:bg-neutral-900 hover:text-red-400">
                <span className="sr-only">Видалити</span>
                <TrashIcon className="w-5" />
            </button>
        </form>
    );
}

export function ShareButton() {
    const pathname = usePathname();
    const base = "http://localhost:3000";
    const link = base + pathname;

    const copylink = () => {
        navigator.clipboard.writeText(link);
    };

    return (
        <button
            className="transition-colors rounded-md border p-2 hover:bg-blue-500 hover:text-white"
            onClick={copylink}
        >
            <ShareIcon className="w-5" />
        </button>
    );
}

export const PlayButton = ({ episode }: { episode: ExtendedEpisode }) => {
    const { setEpisode } = usePlayer();

    const handlePlayEpisode = (episode: ExtendedEpisode) => {
        setEpisode(episode);
    };

    return (
        <button className="transition-colors hover:text-neutral-300" onClick={() => handlePlayEpisode(episode)}>
            <PlayCircleIcon className="w-12" />
        </button>
    );
};

export const ListenPodcastButton = ({ episodes }: { episodes: ExtendedEpisode[] }) => {
    const { setEpisode } = usePlayer();

    const handlePlayEpisode = (episodes: ExtendedEpisode[]) => {
        if (episodes.length > 0) setEpisode(episodes[0]);
    };

    return (
        <button
            aria-disabled={episodes.length !== 0 ? false : true}
            type="button"
            className="flex justify-center items-center gap-2 border border-neutral-500 bg-blue-500 hover:bg-blue-400 rounded-md py-1 w-full md:w-48 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:opacity-50"
            onClick={() => handlePlayEpisode(episodes)}
        >
            <SignalIcon className="w-5" />
            <span className="text-nowrap">{episodes.length !== 0 ? "Слухати" : "Без епізодів"}</span>
        </button>
    );
};
