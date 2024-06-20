"use client";

import { useRef, useState } from "react";
import { Categories, Podcast, Tags } from "@/app/lib/definitions";
import clsx from "clsx";
import Search from "@/app/ui/search";
import PodcastList from "@/app/ui/podcastList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    AdjustmentsVerticalIcon,
    Bars3BottomRightIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";

type SortByList = "title" | "updated_at" | "created_at";
type OrderList = "ASC" | "DESC";

export default function Catalog({
    categories,
    tags,
    podcasts,
    currSort,
    currOrder,
    filters,
}: {
    categories: Categories[];
    tags: Tags[];
    podcasts?: Podcast[];
    currSort: SortByList;
    currOrder: OrderList;
    filters: {
        categories: string[];
        tags: string[];
        age: string[];
        status: string[];
        year_max: string;
        year_min: string;
        episode_max: string;
        episode_min: string;
    };
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [activeSort, setActiveSort] = useState<SortByList>(currSort);
    const [activeOrder, setActiveOrder] = useState<OrderList>(currOrder);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories);
    const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags);
    const [selectedAgeRating, setSelectedAgeRating] = useState<string[]>(filters.age);
    const [selectedStatus, setSelectedStatus] = useState<string[]>(filters.status);
    const [yearMin, setYearMin] = useState(filters.year_min);
    const [yearMax, setYearMax] = useState(filters.year_max);
    const [episodesMin, setEpisodesMin] = useState(filters.episode_min);
    const [episodesMax, setEpisodesMax] = useState(filters.episode_max);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isDdOpen, setIsDdOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sortByList: {
        label: string;
        value: SortByList;
    }[] = [
        { label: "По назві", value: "title" },
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
    const ageRatingList = [
        {
            label: "Немає",
            value: "0",
        },
        {
            label: "6+",
            value: "6+",
        },
        {
            label: "12+",
            value: "12+",
        },
        {
            label: "16+",
            value: "16+",
        },
        {
            label: "18+",
            value: "18+",
        },
    ];

    const statusList = [
        {
            label: "Анонсовано",
            value: "announced",
        },
        {
            label: "Триває",
            value: "ongoing",
        },
        {
            label: "Опубліковано",
            value: "published",
        },
        {
            label: "Випуск закінчено",
            value: "discontinued",
        },
    ];

    const handleSortChange = (param: "sort_by" | "order", value: string) => {
        switch (param) {
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

    const handleSelect = (type: "category" | "tag" | "age" | "status", option: string) => {
        switch (type) {
            case "category":
                setSelectedCategories((prevState) => {
                    if (prevState.includes(option)) {
                        return prevState.filter((item) => item !== option);
                    } else {
                        return [...prevState, option];
                    }
                });
                break;
            case "tag":
                setSelectedTags((prevState) => {
                    if (prevState.includes(option)) {
                        return prevState.filter((item) => item !== option);
                    } else {
                        return [...prevState, option];
                    }
                });
                break;
            case "age":
                setSelectedAgeRating((prevState) => {
                    if (prevState.includes(option)) {
                        return prevState.filter((item) => item !== option);
                    } else {
                        return [...prevState, option];
                    }
                });
                break;
            case "status":
                setSelectedStatus((prevState) => {
                    if (prevState.includes(option)) {
                        return prevState.filter((item) => item !== option);
                    } else {
                        return [...prevState, option];
                    }
                });
                break;
            default:
                break;
        }
    };

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(","));
        } else {
            params.delete("categories");
        }

        if (selectedTags.length > 0) {
            params.set("tags", selectedTags.join(","));
        } else {
            params.delete("tags");
        }

        if (yearMax) {
            params.set("year_max", yearMax);
        } else {
            params.delete("year_max");
        }

        if (yearMin) {
            params.set("year_min", yearMin);
        } else {
            params.delete("year_min");
        }

        if (episodesMax) {
            params.set("episodes_max", episodesMax);
        } else {
            params.delete("episodes_max");
        }

        if (episodesMin) {
            params.set("episodes_min", episodesMin);
        } else {
            params.delete("episodes_min");
        }

        if (selectedAgeRating.length > 0) {
            params.set("age", selectedAgeRating.join(","));
        } else {
            params.delete("age");
        }

        if (selectedStatus.length > 0) {
            params.set("status", selectedStatus.join(","));
        } else {
            params.delete("status");
        }

        replace(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        const params = new URLSearchParams(searchParams);

        params.delete("categories");
        params.delete("tags");
        params.delete("year_max");
        params.delete("year_min");
        params.delete("episodes_max");
        params.delete("episodes_min");
        params.delete("age");
        params.delete("status");

        setSelectedCategories([]);
        setSelectedTags([]);
        setSelectedAgeRating([]);
        setSelectedStatus([]);
        setYearMin("");
        setYearMax("");
        setEpisodesMin("");
        setEpisodesMax("");

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="md:relative flex flex-row justify-between items-center px-6 py-3 bg-neutral-800 rounded-lg">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">Каталог</h1>
                <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef} onBlur={handleBlur}>
                        <button
                            type="button"
                            onFocus={() => setIsDdOpen(true)}
                            className="flex items-center gap-2 hover:bg-neutral-600 p-2 rounded-lg"
                        >
                            <Bars3BottomRightIcon className="w-5" />
                            <span className="hidden md:block text-sm text-neutral-300">
                                {sortByList.find((sortByItem) => sortByItem.value === activeSort)?.label}
                            </span>
                            <ChevronDownIcon className="w-3 hidden md:block" />
                        </button>
                        <div
                            className={clsx(
                                "fixed md:absolute z-40 right-0 bottom-0 md:bottom-auto w-full md:w-56",
                                isDdOpen ? "block md:flex" : "hidden"
                            )}
                        >
                            <div
                                className="relative flex md:w-full flex-col flex-nowrap gap-2 px-2 py-3 bg-neutral-900 mx-2 my-3 md:m-0 rounded-lg"
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
                                                    !isActive && handleSortChange("sort_by", item.value);
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
                                                <label
                                                    htmlFor={`sort_by_${item.value}`}
                                                    className="text-sm cursor-pointer"
                                                >
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
                                                    !isActive && handleSortChange("order", order.value);
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
                                                <label
                                                    htmlFor={`order_${order.value}`}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    {order.label}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onFocus={() => setIsFiltersOpen(true)}
                        className="lg:hidden flex items-center gap-2 hover:bg-neutral-600 p-2 rounded-lg"
                    >
                        <AdjustmentsVerticalIcon className="w-5" />
                        <span className="hidden md:block text-sm text-neutral-300">Фільтри</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-0">
                <div
                    className={clsx(
                        "fixed left-0 bottom-0 h-full p-2 bg-neutral-800 z-50 lg:relative flex flex-col transition-all shrink-0 gap-4 lg:z-0 w-full h-fit max-h-3/4 lg:w-1/4 md:p-2 lg:bg-neutral-800 rounded-lg overflow-y-hidden no-scrollbar",
                        isFiltersOpen ? "flex" : "hidden lg:flex"
                    )}
                >
                    <div className="lg:hidden sticky top-0 bg-neutral-800 flex w-full items-center justify-between">
                        <button
                            className="flex gap-2 items-center py-3 text-neutral-400"
                            onClick={() => setIsFiltersOpen(false)}
                        >
                            <ChevronLeftIcon className="w-5" />
                            <span className="text-bold text-sm text-neutral-200">Фільтри</span>
                        </button>
                    </div>
                    <div>
                        <div className="flex flex-col gap-1 w-full overflow-hidden">
                            <button
                                type="button"
                                className="flex transition-all justify-between items-center py-2 px-3 hover:bg-neutral-700 rounded-lg"
                                onClick={() => setIsCategoriesOpen(true)}
                            >
                                <span className="text-bold text-neutral-300">Категорії</span>
                                <div className="flex gap-2 text-neutral-400">
                                    <span className="text-sm">
                                        {selectedCategories.length > 0
                                            ? "Вибрано " + selectedCategories.length
                                            : "Будь-які"}
                                    </span>
                                    <ChevronRightIcon className="w-4" />
                                </div>
                            </button>
                            <div
                                className={clsx(
                                    "absolute transition-all h-full w-full h-fit bg-neutral-800 overflow-x-auto z-10 px-3 top-0",
                                    isCategoriesOpen ? "left-0" : "-left-full"
                                )}
                            >
                                <div className="sticky top-0 bg-neutral-800 flex w-full items-center justify-between py-2">
                                    <button
                                        className="flex gap-2 items-center py-3 text-neutral-400"
                                        onClick={() => setIsCategoriesOpen(false)}
                                    >
                                        <ChevronLeftIcon className="w-5" />
                                        <span className="text-bold text-sm text-neutral-200">Категорії</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="text-bold text-sm text-neutral-400"
                                        onClick={() => setSelectedCategories([])}
                                    >
                                        Скинути
                                    </button>
                                </div>

                                {categories.map((category) => {
                                    const isActive = selectedCategories.includes(category.name);
                                    return (
                                        <label
                                            key={category.id}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`category_${category.id}`}
                                                name="category"
                                                checked={isActive}
                                                onChange={() => handleSelect("category", category.name)}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded cursor-pointer shrink-0",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                            />
                                            <span className="text-sm cursor-pointer">{category.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full overflow-hidden">
                            <button
                                type="button"
                                className="flex transition-all justify-between items-center py-2 px-3 hover:bg-neutral-700 rounded-lg"
                                onClick={() => setIsTagsOpen(true)}
                            >
                                <span className="text-bold text-neutral-300">Теги</span>
                                <div className="flex gap-2 text-neutral-400">
                                    <span className="text-sm">
                                        {selectedTags.length > 0 ? "Вибрано " + selectedTags.length : "Будь-які"}
                                    </span>
                                    <ChevronRightIcon className="w-4" />
                                </div>
                            </button>
                            <div
                                className={clsx(
                                    "absolute transition-all h-full w-full h-fit bg-neutral-800 overflow-x-auto z-10 px-3 top-0",
                                    isTagsOpen ? "left-0" : "-left-full"
                                )}
                            >
                                <div className="sticky top-0 bg-neutral-800 flex w-full items-center justify-between py-2">
                                    <button
                                        className="flex gap-2 items-center py-3 text-neutral-400"
                                        onClick={() => setIsTagsOpen(false)}
                                    >
                                        <ChevronLeftIcon className="w-5" />
                                        <span className="text-bold text-sm text-neutral-200">Теги</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="text-bold text-sm text-neutral-400"
                                        onClick={() => setSelectedTags([])}
                                    >
                                        Скинути
                                    </button>
                                </div>
                                {tags.map((tag) => {
                                    const isActive = selectedTags.includes(tag.name);
                                    return (
                                        <label
                                            key={tag.id}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`tag_${tag.id}`}
                                                name="tag"
                                                checked={isActive}
                                                onChange={() => handleSelect("tag", tag.name)}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded cursor-pointer shrink-0",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                            />
                                            <span className="text-sm cursor-pointer">{tag.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex transition-all justify-between items-center py-2 px-3">
                            <span className="text-bold text-neutral-300">Рік релізу</span>
                        </div>
                        <div>
                            <div className="w-full flex flex-row items-center justify-between">
                                <div className="flex gap-2 items-center px-3 w-1/2">
                                    <input
                                        type="number"
                                        name="year_min"
                                        maxLength={4}
                                        min={1980}
                                        className="w-full px-2 py-1 rounded-md bg-neutral-800 text-white text-sm border border-neutral-500"
                                        defaultValue={yearMin}
                                        onChange={(e) => setYearMin(e.target.value)}
                                    />
                                </div>
                                <div className="bg-neutral-600 h-px w-10" />
                                <div className="flex gap-2 items-center py-2 px-3 w-1/2">
                                    <input
                                        type="number"
                                        name="year_max"
                                        maxLength={4}
                                        min={1980}
                                        className="w-full px-2 py-1 rounded-md bg-neutral-800 text-white text-sm border border-neutral-500"
                                        defaultValue={yearMax}
                                        onChange={(e) => setYearMax(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex transition-all justify-between items-center py-2 px-3">
                            <span className="text-bold text-neutral-300">Кількість епізодів</span>
                        </div>
                        <div>
                            <div className="w-full flex flex-row items-center justify-between">
                                <div className="flex gap-2 items-center px-3 w-1/2">
                                    <input
                                        type="number"
                                        name="episodes_min"
                                        min={0}
                                        className="w-full px-2 py-1 rounded-md bg-neutral-800 text-white text-sm border border-neutral-500"
                                        defaultValue={episodesMin}
                                        onChange={(e) => setEpisodesMin(e.target.value)}
                                    />
                                </div>
                                <div className="bg-neutral-600 h-px w-10" />
                                <div className="flex gap-2 items-center py-2 px-3 w-1/2">
                                    <input
                                        type="number"
                                        name="episodes_max"
                                        min={0}
                                        className="w-full px-2 py-1 rounded-md bg-neutral-800 text-white text-sm border border-neutral-500"
                                        defaultValue={episodesMax}
                                        onChange={(e) => setEpisodesMax(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex transition-all justify-between items-center py-2 px-3">
                            <span className="text-bold text-neutral-300">Віковий рейтинг</span>
                        </div>
                        <div className="transition-all columns-2">
                            {ageRatingList.map((age) => {
                                const isActive = selectedAgeRating.includes(age.value);
                                return (
                                    <div key={age.value}>
                                        <label
                                            htmlFor={`age_${age.value}`}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`age_${age.value}`}
                                                name="age"
                                                defaultChecked={isActive}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded cursor-pointer shrink-0",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                                onClick={() => {
                                                    handleSelect("age", age.value);
                                                }}
                                            />
                                            <span className="text-sm">{age.label}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex transition-all justify-between items-center py-2 px-3">
                            <span className="text-bold text-neutral-300">Статус подкасту</span>
                        </div>
                        <div className="transition-all">
                            {statusList.map((status) => {
                                const isActive = selectedStatus.includes(status.value);
                                return (
                                    <div key={status.value}>
                                        <label
                                            htmlFor={`status_${status.value}`}
                                            className={clsx(
                                                "transition-all flex items-center gap-2 px-4 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 cursor-pointer",
                                                isActive && "text-white"
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`status_${status.value}`}
                                                name="status"
                                                defaultChecked={isActive}
                                                className={clsx(
                                                    "appearance-none w-4 h-4 rounded cursor-pointer shrink-0",
                                                    isActive
                                                        ? "border-4 border-blue-500"
                                                        : "border-2 border-neutral-400"
                                                )}
                                                onClick={() => {
                                                    handleSelect("status", status.value);
                                                }}
                                            />
                                            <span className="text-sm">{status.label}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-2 mb-2 text-sm">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="transition-all w-1/2 py-1 text-neutral-300 hover:bg-neutral-700 border border-neutral-500 rounded-lg"
                        >
                            Скинути
                        </button>
                        <button
                            type="button"
                            onClick={handleFilter}
                            className="transition-all w-1/2 py-1 font-medium rounded-lg bg-blue-600 hover:bg-blue-500"
                        >
                            Застосувати
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4 w-full h-fit lg:w-3/4 rounded-lg">
                    <div className="w-full">
                        <Search placeholder="Пошук подкастів..." />

                        <div className="mt-6 bg-neutral-800">
                            <PodcastList podcasts={podcasts || []} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
