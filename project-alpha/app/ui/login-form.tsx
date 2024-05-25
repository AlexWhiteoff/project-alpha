"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { signIn } from "@/app/lib/actions/auth";

export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(signIn, undefined);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    return (
        <form action={dispatch} className="space-y-3">
            <div className="px-6 pb-4 pt-16 mx-auto w-[400px]">
                <div className="my-4">
                    <div>
                        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Please log in to continue.</h1>
                        <div className="my-4">
                            <div className="my-4">
                                <label className="block text-sm font-medium text-grey-800" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    type="email"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="name@domain.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-4">
                    <label className="block text-sm font-medium text-grey-800" htmlFor="password">
                        Password
                    </label>
                    <div className="flex flex-col justify-center items-end mt-1">
                        <input
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 pl-2 pr-10 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="relative mr-2 bottom-8 text-gray-500 hover:text-gray-800"
                        >
                            {isPasswordVisible ? <EyeIcon className="w-6" /> : <EyeSlashIcon className="w-6" />}
                        </button>
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-sm">
                        <span className="text-red-500">{errorMessage.message}</span>
                    </div>
                )}
                <LoginButton />
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (pending) {
            event.preventDefault();
        }
    };

    return (
        <Button className="mt-4 w-full" aria-disabled={pending} onClick={handleClick}>
            {pending ? "Submitting..." : "Log in"}
        </Button>
    );
}
