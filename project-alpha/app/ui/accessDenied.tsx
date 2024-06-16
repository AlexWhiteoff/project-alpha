"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

function AccessDenied() {
    const router = useRouter();

    const handleReturnClick = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-400">Відмовлено в доступі</h2>
                </div>
                <p className="mt-2 text-center text-sm text-white">
                    У вас недостатньо прав для перегляду цієї сторінки.
                </p>
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={handleReturnClick}
                        className="flex items-center gap-2 mt-4 rounded-md bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-400"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Повернутися
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccessDenied;
