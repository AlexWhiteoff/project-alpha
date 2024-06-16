"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { editUser } from "@/app/lib/actions/mainActions";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";
import ImageInput from "@/app/ui/imageInput";
import { User } from "@/app/lib/definitions";

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

const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
];

export default function UserEditForm({ user, sesion_role }: { user: User; sesion_role: User["role"] }) {
    const UpdateUserWithId = editUser.bind(null, user.id);
    const [state, dispatch] = useFormState(UpdateUserWithId, undefined);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);

    const birthday_date = new Date(user.birthday_date);

    const handleSubmit = (data: FormData) => {
        data.set("avatar", avatar as File);
        data.set("banner", banner as File);

        dispatch(data);
    };

    return (
        <form action={handleSubmit}>
            <div aria-describedby="form-error" className="flex flex-col gap-4">
                {/* Avatar Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="avatar" className="block text-sm font-medium text-neutral-400">
                        Аватар
                    </label>
                    <ImageInput
                        format="square"
                        name="avatar"
                        id="avatar"
                        value={
                            user.avatar_url
                                ? `/assets/users/${user.id}/${user.avatar_url}`
                                : "/assets/users/placeholder_avatar.jpg"
                        }
                        setValue={setAvatar}
                        className="peer w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="cover-cover-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.avatar &&
                            state.errors.avatar.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* User Banner Image */}
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

                {/* User name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-400">
                        Ім&apos;я
                    </label>
                    <input
                        id="username"
                        name="username"
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        required
                        defaultValue={user.username}
                    />
                    <div id="username-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.username &&
                            state.errors.username.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="gender" className="block text-sm font-medium text-neutral-400">
                        Ґендер/стать
                    </label>
                    <select
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        name="gender"
                        id="gender"
                        required
                        defaultValue={user.gender || ""}
                    >
                        <option value="" disabled className="text-white">
                            Оберіть стать
                        </option>
                        {genders.map((gender) => (
                            <option key={gender.value} value={gender.value} className="text-white">
                                {gender.name}
                            </option>
                        ))}
                    </select>
                    <div id="age_rating-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.gender &&
                            state.errors.gender.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="block text-sm font-medium text-neutral-400">Дата народження</div>
                    <div className="flex flex-row gap-1">
                        <div className="flex gap-2 w-full">
                            <input
                                className="w-24 peer block rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                                type="number"
                                name="birthday_day"
                                id="birthday_day"
                                max={31}
                                min={1}
                                maxLength={2}
                                defaultValue={birthday_date.getDate()}
                                placeholder="dd"
                                required
                            />
                            <select
                                className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                                name="birthday_month"
                                id="birthday_month"
                                required
                                defaultValue={birthday_date.getMonth() + 1 || 0}
                            >
                                <option value={0} disabled className="text-white">
                                    Місяць
                                </option>
                                {months.map((month) => (
                                    <option key={month.value} value={month.value} className="text-white">
                                        {month.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="w-24 peer block rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                                type="number"
                                name="birthday_year"
                                id="birthday_year"
                                min={1900}
                                max={new Date().getFullYear()}
                                maxLength={4}
                                placeholder="yyyy"
                                defaultValue={birthday_date.getFullYear()}
                                required
                            />
                        </div>
                    </div>
                    <div id="birthday-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.birthday_day &&
                            state.errors.birthday_day.map((error) => (
                                <div key={error} className="text-sm text-red-500">
                                    {error}
                                </div>
                            ))}
                        {state?.errors?.birthday_month &&
                            state.errors.birthday_month.map((error) => (
                                <div key={error} className="text-sm text-red-500">
                                    {error}
                                </div>
                            ))}
                        {state?.errors?.birthday_year &&
                            state.errors.birthday_year.map((error) => (
                                <div key={error} className="text-sm text-red-500">
                                    {error}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Role */}
            {sesion_role === "admin" && (
                <div className="flex flex-col gap-1">
                    <label htmlFor="role" className="block text-sm font-medium text-neutral-400">
                        Роль
                    </label>
                    <select
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        name="role"
                        id="role"
                        required
                        defaultValue={user.role || ""}
                    >
                        <option value="" disabled className="text-white">
                            Оберіть роль
                        </option>
                        <option value="user" className="text-white">
                            Користувач
                        </option>
                        <option value="content_creator" className="text-white">
                            Творець контенту
                        </option>
                        <option value="admin" className="text-white">
                            Адміністратор
                        </option>
                    </select>
                    <div id="role-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.role &&
                            state.errors.role.map((error: string) => (
                                <div key={error} className="text-sm text-red-500">
                                    {error}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={`/p/profile/${user.id}`}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Відмінити
                </Link>
                <Button type="submit">Зберегти</Button>
            </div>
        </form>
    );
}
