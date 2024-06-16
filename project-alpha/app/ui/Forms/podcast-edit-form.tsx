"use client";

import React, { useState } from "react";
import { Categories, EpisodeTable, Podcast, Tags } from "@/app/lib/definitions";
import Link from "next/link";
import {
    DocumentTextIcon as OutlineDocumentTextIcon,
    PhotoIcon as OutlinePhotoIcon,
    TagIcon as OutlineTagIcon,
    AdjustmentsHorizontalIcon as OutlineAdjustmentsHorizontalIcon,
    RectangleStackIcon as OutlineRectangleStackIcon,
    ArrowLeftIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";
import {
    DocumentTextIcon as SolidDocumentTextIcon,
    PhotoIcon as SolidPhotoIcon,
    TagIcon as SolidTagIcon,
    AdjustmentsHorizontalIcon as SolidAdjustmentsHorizontalIcon,
    RectangleStackIcon as SolidRectangleStackIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import EpisodesTab from "../Episodes/settings-episode-tab";
import MainInfoTab from "./update-form/mainInfoTab";
import MediaTab from "./update-form/mediaTab";
import ClassificationTab from "./update-form/classificationTab";
import ManagementTab from "./update-form/managementTab";

interface PodcastFormProps {
    user_role: "admin" | "content_creator" | "user";
    podcast: Podcast;
    podcastCategories: Categories[];
    podcastTags: Tags[];
    categories: Categories[];
    tags: Tags[];
    episodes: EpisodeTable[];
}

const tabs = [
    {
        label: "Основна інформація",
        href: "information",
        icon: { solid: SolidDocumentTextIcon, outline: OutlineDocumentTextIcon },
    },
    {
        label: "Медіа",
        href: "media",
        icon: { solid: SolidPhotoIcon, outline: OutlinePhotoIcon },
    },
    {
        label: "Класифікація",
        href: "classification",
        icon: { solid: SolidTagIcon, outline: OutlineTagIcon },
    },
    {
        label: "Управління подкастом",
        href: "adjustments",
        icon: { solid: SolidAdjustmentsHorizontalIcon, outline: OutlineAdjustmentsHorizontalIcon },
    },
    {
        label: "Епізоди",
        href: "episodes",
        icon: { solid: SolidRectangleStackIcon, outline: OutlineRectangleStackIcon },
    },
];

export default function PodcastEditForm({
    user_role,
    podcast,
    podcastCategories,
    podcastTags,
    categories,
    tags,
    episodes,
}: PodcastFormProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="relative flex flex-col md:gap-4 max-w-[1168px] w-full overflow-y-auto md:p-4">
                <div className="sticky top-0 flex items-center justify-between w-full gap-6 bg-neutral-800 md:rounded-lg px-4 py-2">
                    <Link
                        href={`/p/podcast/${podcast.id}`}
                        className="transition-colors p-2 rounded-full hover:bg-neutral-700"
                    >
                        <ArrowLeftIcon className="w-5" />
                    </Link>
                    <h1 className="font-medium text-xl text-neutral-300 w-full">{tabs[activeTab].label}</h1>
                    <button
                        type="button"
                        className="flex md:hidden transition-colors p-2 rounded-full hover:bg-neutral-700"
                        onClick={() => setIsMenuOpen((prevState) => !prevState)}
                    >
                        <Bars3Icon className="w-6" />
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div
                        className={clsx(
                            "md:flex transition-all flex-col shrink-0 gap-2 mx-6 md:mx-0 md:w-full h-fit lg:w-1/4 py-4 lg:bg-neutral-800 rounded-b-lg overflow-y-hidden",
                            isMenuOpen ? "flex h-fit bg-neutral-800" : "hidden h-0"
                        )}
                    >
                        {tabs.map((tab, index) => {
                            const isTabActive = activeTab === index;
                            const Icon = isTabActive ? tab.icon.solid : tab.icon.outline;
                            return (
                                <div
                                    key={index}
                                    className={clsx(
                                        "transition-all flex items-center gap-2 px-4 py-2 rounded-md hover:bg-neutral-700 cursor-pointer",
                                        isTabActive ? "text-white" : "text-neutral-300"
                                    )}
                                    onClick={() => {
                                        !isTabActive && setActiveTab(index);
                                    }}
                                >
                                    <Icon className="flex w-5 shrink-0" />
                                    <span className="text-sm">{tab.label}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col items-start gap-4 w-full h-fit lg:w-3/4 py-4 px-4 lg:bg-neutral-800 rounded-lg">
                        {activeTab === 0 && <MainInfoTab podcast={podcast} />}
                        {activeTab === 1 && <MediaTab podcast={podcast} />}
                        {activeTab === 2 && (
                            <ClassificationTab
                                podcast={podcast}
                                podcastCategories={podcastCategories}
                                podcastTags={podcastTags}
                                categories={categories}
                                tags={tags}
                            />
                        )}
                        {activeTab === 3 && <ManagementTab podcast={podcast} user_role={user_role} />}
                        {activeTab === 4 && <EpisodesTab podcastId={podcast.id} episodes={episodes} />}
                    </div>
                </div>
            </div>
        </>
    );
}
