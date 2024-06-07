"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { createPodcast } from "@/app/lib/actions/mainActions";
import { Categories, Tags } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import ImageInput from "@/app/ui/imageInput";
import MultipleSelect from "@/app/ui/multipleSelect";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";

interface PodcastFormProps {
    categories: Categories[];
    tags: Tags[];
}

export default function PodcastCreateForm({ categories, tags }: PodcastFormProps) {
    const [state, dispatch] = useFormState(createPodcast, undefined);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleSubmit = (data: FormData) => {
        data.set("avatar", avatar as File);
        data.set("banner", banner ? banner : "");
        data.set("categories", JSON.stringify(selectedCategories));
        data.set("tags", JSON.stringify(selectedTags));

        dispatch(data);
    };

    return (
        <form action={handleSubmit}>
            <div aria-describedby="form-error" className="flex flex-col gap-3">
                {/* Podcast Cover Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="avatar" className="block text-sm font-medium text-neutral-400">
                        Обкладинка
                    </label>
                    <ImageInput
                        format="square"
                        name="avatar"
                        id="avatar"
                        setValue={setAvatar}
                        className="peer w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="cover-image-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.avatar &&
                            state.errors.avatar.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Podcast Banner Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="banner" className="block text-sm font-medium text-neutral-400">
                        Банер
                    </label>
                    <ImageInput
                        format="landscape"
                        name="banner"
                        id="banner"
                        setValue={setBanner}
                        className="peer w-full lg:w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="banner-image-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.banner &&
                            state.errors.banner.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-400">
                        Назва
                    </label>
                    <input
                        id="title"
                        name="title"
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        required
                    />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-400">
                        Опис
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        required
                    />
                    <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Age Rating */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="age_rating" className="block text-sm font-medium text-neutral-400">
                        Віковий рейтинг
                    </label>
                    <select
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        name="age_rating"
                        id="age_rating"
                        required
                        defaultValue={""}
                    >
                        <option value="" disabled className="text-white">
                            Виберіть віковий рейтинг
                        </option>
                        <option value="0" className="text-white">
                            Немає
                        </option>
                        <option value="6+" className="text-white">
                            6+
                        </option>
                        <option value="12+" className="text-white">
                            12+
                        </option>
                        <option value="16+" className="text-white">
                            16+
                        </option>
                        <option value="18+" className="text-white">
                            18+
                        </option>
                    </select>
                    <div id="age_rating-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.age_rating &&
                            state.errors.age_rating.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="categories" className="block text-sm font-medium text-neutral-400">
                        Категорії
                    </label>
                    <MultipleSelect
                        type="Категорії"
                        options={categories}
                        values={selectedCategories}
                        setValue={setSelectedCategories}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="tags" className="block text-sm font-medium text-neutral-400">
                        Теги
                    </label>
                    <MultipleSelect type="Теги" options={tags} values={selectedTags} setValue={setSelectedTags} />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/p/"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Відмінити
                </Link>
                <Button type="submit">Створити подкаст</Button>
            </div>
        </form>
    );
}
