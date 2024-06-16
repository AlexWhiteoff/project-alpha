"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { createEpisode } from "@/app/lib/actions/mainActions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import AudioInput from "@/app/ui/Episodes/audioInput";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";
import ImageInput from "@/app/ui/imageInput";

export default function EpisodeCreateForm({ podcast_id }: { podcast_id: string }) {
    const [state, dispatch] = useFormState(createEpisode, undefined);
    const [image, setImage] = useState<File | null>(null);
    const [audio, setAudio] = useState<File | null>(null);

    const handleSubmit = (data: FormData) => {
        data.set("podcast_id", podcast_id);
        data.set("image", image as File);
        data.set("audio", audio as File);

        dispatch(data);
    };

    return (
        <form action={handleSubmit}>
            <div aria-describedby="form-error" className="flex flex-col gap-3">
                {/* Podcast Cover Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="image" className="block text-sm font-medium text-neutral-400">
                        Обкладинка епізоду
                    </label>
                    <ImageInput
                        format="square"
                        name="image"
                        id="image"
                        setValue={setImage}
                        className="peer w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="cover-cover-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.image &&
                            state.errors.image.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Podcast Banner Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="audio" className="block text-sm font-medium text-neutral-400">
                        Аудіофайл епізоду
                    </label>
                    <AudioInput
                        name="audio"
                        id="audio"
                        setValue={setAudio}
                        className="peer w-full lg:w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть аудіофайл</p>
                    </AudioInput>
                    <div id="audio-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.audio &&
                            state.errors.audio.map((error: string) => (
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
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/p/"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Відмінити
                </Link>
                <Button type="submit">Створити епізод</Button>
            </div>
        </form>
    );
}
