import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <FaceFrownIcon className="w-10 text-blue-400" />
            <h2 className="text-xl font-semibold">404 &ndash; Не Знайдено</h2>
            <p className="text-center">
                Ми шукали, але не змогли знайти відпвідну сторінку.
                <br />
                Спробуйте повернутися та спробувати ще раз.
            </p>
            <Link
                href="/"
                className="mt-4 rounded-md bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
                Повернутися
            </Link>
        </main>
    );
}
