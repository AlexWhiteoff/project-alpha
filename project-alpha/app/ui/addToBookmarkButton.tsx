"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addToBookmarks, deleteFromBookmarks } from "@/app/lib/actions/mainActions";
import { getUserBookmarkByPodcastId } from "@/app/lib/data";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

type BookmarkLists = "listening" | "planned" | "abandoned" | "finished" | "favorite" | null | undefined;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    podcast_id: string;
    user_id: string;
    bookmarkList: BookmarkLists;
}

export const AddToBookmarkButton = ({ className, podcast_id, user_id, bookmarkList, ...rest }: ButtonProps) => {
    const [listType, setListType] = useState<BookmarkLists>(bookmarkList);
    const [isDdOpen, setIsDdOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const bookmarkLabels: { label: string; value: BookmarkLists }[] = [
        { label: "Слухаю", value: "listening" },
        { label: "Заплановані", value: "planned" },
        { label: "Покинуті", value: "abandoned" },
        { label: "Прослухано", value: "finished" },
        { label: "Улюблені", value: "favorite" },
    ];

    const handleAddToBookmark = async (option: BookmarkLists) => {
        setIsDdOpen(false);

        if (!option) return;

        try {
            const response = await addToBookmarks({ user_id, podcast_id, list_type: option });

            if (response.status === "success") {
                setListType(response.data);
            } else {
                console.error("Failed to add to bookmark:", response.message);
            }
        } catch (error) {
            console.error("Error adding to bookmark:", error);
        }
    };

    const handleDeleteFromBookmark = async () => {
        try {
            await deleteFromBookmarks(user_id, podcast_id);
            setListType(null);
        } catch (error) {
            console.error("Error deleting from bookmark:", error);
        }
    };

    const ButtonContent = () => {
        const bookmark = bookmarkLabels.find((item) => item.value === listType);

        if (bookmark) {
            return (
                <div
                    className={clsx("flex items-center gap-2 px-2 py-1", {
                        "text-violet-400": listType === "listening",
                        "text-blue-400": listType === "planned",
                        "text-red-400": listType === "abandoned",
                        "text-green-400": listType === "finished",
                        "text-yellow-400": listType === "favorite",
                    })}
                >
                    <BookmarkIcon className="w-5" />
                    <span className="text-sm font-medium">{bookmark.label}</span>
                </div>
            );
        } else
            return (
                <div className="flex items-center gap-2 px-2 py-1">
                    <PlusIcon className="w-5" />
                    <span className="text-sm font-medium">Додати в</span>
                </div>
            );
    };

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget as Node)) {
            setIsDdOpen(false);
        }
    };

    return (
        <div className="md:relative w-full md:w-auto" ref={dropdownRef} onBlur={handleBlur}>
            <button
                type="button"
                {...rest}
                onFocus={() => setIsDdOpen(true)}
                className="flex justify-center items-center gap-2 border border-neutral-500 bg-neutral-800 hover:bg-neutral-600 rounded-md py-1 w-full md:w-48 transition-colors"
            >
                <ButtonContent />
            </button>
            <div
                className={clsx(
                    "absolute left-0 md:left-auto z-40 w-full flex-col p-2 bg-neutral-900 rounded-md",
                    isDdOpen ? "flex" : "hidden"
                )}
            >
                <ul className="overflow-y-auto" tabIndex={-1}>
                    {bookmarkLabels.map((option) => (
                        <li
                            key={option.label}
                            className="transition-all flex items-center justify-start w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 cursor-pointer"
                            onClick={() => handleAddToBookmark(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                    {listType && (
                        <li
                            className="transition-all flex items-center justify-start w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-neutral-800 text-red-600 cursor-pointer"
                            onClick={() => handleDeleteFromBookmark()}
                        >
                            Видалити зі списку
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
