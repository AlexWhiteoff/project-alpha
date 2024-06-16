import clsx from "clsx";

export default function PodcastStatus({ status, is_active }: { status: string; is_active: boolean }) {
    return (
        <span
            className={clsx(
                "inline-flex items-center bg-neutral-800 rounded-full px-2 py-1 text-sm border border-neutral-300 ",
                {
                    "bg-neutral-400 text-neutral-800": !is_active,
                    "text-blue-400": is_active && status == "pending",
                    "text-violet-400": is_active && status == "announced",
                    "text-yellow-400": is_active && status == "ongoing",
                    "text-green-400": is_active && status == "published",
                    "text-red-400": is_active && status == "discontinued",
                }
            )}
        >
            {status === "pending" && <>Очікує</>}
            {status === "announced" && <>Анонсовано</>}
            {status === "ongoing" && <>Триває</>}
            {status === "published" && <>Опубліковано</>}
            {status === "discontinued" && <>Завершено</>}
        </span>
    );
}
