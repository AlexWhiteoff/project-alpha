"use client";

import { useRef, useState } from "react";
import { Bookmarks, Podcast } from "@/app/lib/definitions";
import clsx from "clsx";
import Search from "@/app/ui/search";
import PodcastList from "@/app/ui/podcastList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bars3BottomRightIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

type BookmarkLists = Bookmarks["list_type"] | "all";
type SortByList = "title" | "updated_at" | "created_at" | "bookmark_updated_at";
type OrderList = "ASC" | "DESC";

export default function Bookmark({
    title,
    bookmarks,
    currList,
    currSort,
    currOrder,
}: {
    title: string;
    bookmarks: Podcast[];
    currList: BookmarkLists;
    currSort?: SortByList;
    currOrder?: OrderList;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [activeTab, setActiveTab] = useState<BookmarkLists>(currList);
    const [activeSort, setActiveSort] = useState<SortByList>(currSort || "bookmark_updated_at");
    const [activeOrder, setActiveOrder] = useState<OrderList>(currOrder || "ASC");

    const [isDdOpen, setIsDdOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const bookmarkList: {
        label: string;
        value: BookmarkLists;
    }[] = [
        { label: "Усі", value: "all" },
        { label: "Слухаю", value: "listening" },
        { label: "Заплановані", value: "planned" },
        { label: "Покинуті", value: "abandoned" },
        { label: "Прослухано", value: "finished" },
        { label: "Улюблені", value: "favorite" },
    ];
    const sortByList: {
        label: string;
        value: SortByList;
    }[] = [
        { label: "По назві", value: "title" },
        { label: "Даті додавання", value: "bookmark_updated_at" },
        { label: "Даті оновлення", value: "updated_at" },
        { label: "Даті створення", value: "created_at" },
    ];
    const orderList: {
        label: string;
        value: OrderList;
    }[] = [
        { label: "За зменшенням", value: "DESC" },
        { label: "За зростанням", value: "ASC" },
    ];

    const handleChange = (param: "list" | "sort_by" | "order", value: string) => {
        switch (param) {
            case "list":
                setActiveTab(value as BookmarkLists);
                break;
            case "sort_by":
                setActiveSort(value as SortByList);
                break;
            case "order":
                setActiveOrder(value as OrderList);
                break;
            default:
                return;
        }

        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(param, value);
        } else {
            params.delete(param);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget as Node)) {
            setIsDdOpen(false);
        }
    };

    return (
        <>
            <div className="md:relative flex flex-row justify-between items-center px-6 py-3 bg-neutral-800 rounded-lg">
                <h1 className="text-md md:text-xl lg:text-2xl xl:text-3xl font-bold">{title}</h1>
                <div className="relative" ref={dropdownRef} onBlur={handleBlur}>
                    <button
                        type="button"
                        onFocus={() => setIsDdOpen(true)}
                        className="flex lg:hidden items-center gap-2 hover:bg-neutral-600 p-2 rounded-lg"
                    >
                        <Bars3BottomRightIcon className="w-5" />
                        <span className="hidden md:block text-sm text-neutral-300">
                            {sortByList.find((sortByItem) => sortByItem.value === activeSort)?.label}
                        </span>
                        <ChevronDownIcon className="w-3" />
                    </button>
                    <div className={clsx("fixed z-40 left-0 bottom-0 w-full", isDdOpen ? "block" : "hidden")}>
                        <div
                            className="flex flex-col gap-2 px-2 py-3 bg-neutral-900 mx-2 my-3 rounded-lg"
                            tabIndex={-1}
                        >
                            <fieldset className="border-t border-neutral-700 pt-2 flex flex-col gap-1 w-full">
                                <legend className="text-bold text-sm text-neutral-300 ml-4 px-2">Сортування</legend>
                                {sortByList.map((item) => {
                                    const isActive = activeSort === item.value;
                                    return (
                                        <div
                                            key={item.value}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                            onClick={() => {
                                                !isActive && handleChange("sort_by", item.value);
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                id={`sort_by_${item.value}`}
                                                name="sort_by"
                                                defaultChecked={isActive}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded-full cursor-pointer",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                            />
                                            <label htmlFor={`sort_by_${item.value}`} className="text-sm cursor-pointer">
                                                {item.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </fieldset>
                            <fieldset className="border-t border-neutral-700 pt-2 flex flex-col gap-1 w-full">
                                {orderList.map((order) => {
                                    const isActive = activeOrder === order.value;
                                    return (
                                        <div
                                            key={order.value}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                            onClick={() => {
                                                !isActive && handleChange("order", order.value);
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                id={`order_${order.value}`}
                                                name="order"
                                                defaultChecked={isActive}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded-full cursor-pointer",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                            />
                                            <label htmlFor={`order_${order.value}`} className="text-sm cursor-pointer">
                                                {order.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-0">
                <div className="flex flex-col transition-all shrink-0 gap-4 md:w-full h-fit lg:w-1/4 md:py-4 lg:bg-neutral-800 rounded-lg overflow-y-hidden no-scrollbar">
                    <fieldset className="lg:border-t border-neutral-700 lg:pt-2 px-2 flex md:flex-col gap-1 w-full">
                        <legend className="hidden lg:block text-bold text-sm text-neutral-300 ml-4 px-2">Списки</legend>
                        {bookmarkList.map((tab) => {
                            const isTabActive = activeTab === tab.value;
                            return (
                                <div
                                    key={tab.value}
                                    className={clsx(
                                        "relative transition-all flex items-center gap-2 px-4 py-2 rounded-md md:hover:bg-neutral-700 cursor-pointer",
                                        isTabActive ? "text-white md:bg-neutral-700" : "text-neutral-300"
                                    )}
                                    onClick={() => {
                                        !isTabActive && handleChange("list", tab.value);
                                    }}
                                >
                                    <span className="text-sm">{tab.label}</span>
                                    <div
                                        className={clsx(
                                            "md:hidden absolute bottom-0 left-0 w-full rounded-t-lg",
                                            isTabActive ? "border-2 border-blue-500" : "border-0"
                                        )}
                                    ></div>
                                </div>
                            );
                        })}
                    </fieldset>
                    <fieldset className="hidden lg:flex border-t border-neutral-700 pt-2 flex md:flex-col gap-1 w-full">
                        <legend className="text-bold text-sm text-neutral-300 ml-4 px-2">Сортування</legend>
                        {sortByList.map((item) => {
                            const isActive = activeSort === item.value;
                            return (
                                <div
                                    key={item.value}
                                    className={clsx(
                                        "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                        isActive && "text-white"
                                    )}
                                    onClick={() => {
                                        !isActive && handleChange("sort_by", item.value);
                                    }}
                                >
                                    <input
                                        type="radio"
                                        id={`sort_by_${item.value}`}
                                        name="sort_by"
                                        defaultChecked={isActive}
                                        className={clsx(
                                            "appearance-none w-4 h-4 rounded-full cursor-pointer",
                                            isActive ? "border-4 border-blue-500" : "border-2 border-neutral-400"
                                        )}
                                    />
                                    <label htmlFor={`sort_by_${item.value}`} className="text-sm cursor-pointer">
                                        {item.label}
                                    </label>
                                </div>
                            );
                        })}
                    </fieldset>
                    <fieldset className="hidden lg:flex border-t border-neutral-700 pt-2 flex md:flex-col gap-1 w-full">
                        {orderList.map((order) => {
                            const isActive = activeOrder === order.value;
                            return (
                                <div
                                    key={order.value}
                                    className={clsx(
                                        "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                        isActive && "text-white"
                                    )}
                                    onClick={() => {
                                        !isActive && handleChange("order", order.value);
                                    }}
                                >
                                    <input
                                        type="radio"
                                        id={`order_${order.value}`}
                                        name="order"
                                        defaultChecked={isActive}
                                        className={clsx(
                                            "appearance-none w-4 h-4 rounded-full cursor-pointer",
                                            isActive ? "border-4 border-blue-500" : "border-2 border-neutral-400"
                                        )}
                                    />
                                    <label htmlFor={`order_${order.value}`} className="text-sm cursor-pointer">
                                        {order.label}
                                    </label>
                                </div>
                            );
                        })}
                    </fieldset>
                </div>
                <div className="flex flex-col items-start gap-4 w-full h-fit lg:w-3/4 rounded-lg">
                    <div className="w-full">
                        <Search placeholder="Пошук подкастів..." />

                        <div className="mt-6 bg-neutral-800">
                            <PodcastList podcasts={bookmarks} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
