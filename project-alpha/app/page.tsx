import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-20 shrink-0 items-end py-4 px-20 md:h-52">
                <Image
                    src="/dark_logo_large_transparent.png"
                    width={500}
                    height={200}
                    className="hidden md:block"
                    alt="Logo image of application"
                />
            </div>
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg px-6 py-10 md:w-2/5 md:px-20">
                    <p className={`${lusitana.className} text-xl text-gray-50 md:text-3xl md:leading-normal`}>
                        <strong>Welcome to Project Alpha.</strong> The new way to feel the pulse of the podcast world.
                        Dive into a universe where every word, every story, and every idea comes to life.
                    </p>
                    <div className="flex gap-2 ">
                        <Link
                            href="/signup"
                            className="flex w-[120px] items-center justify-center gap-5 self-center px-6 text-sm font-medium transition-all text-gray-300 hover:text-white hover:text-base md:hover:text-lg md:text-[17px]"
                        >
                            <span>Sign up</span>
                        </Link>
                        <Link
                            href="/login"
                            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-[17px]"
                        >
                            <span>Log in</span>
                            <ArrowRightIcon className="w-5 md:w-6" />
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                    {/* <Image
                        src="/hero-desktop.png"
                        width={1000}
                        height={760}
                        className="hidden md:block"
                        alt="Screenshots of the dashboard project showing desktop version"
                    />
                    <Image
                        src="/hero-mobile.png"
                        width={500}
                        height={620}
                        className="block md:hidden"
                        alt="Screenshots of the dashboard project showing mobile version"
                    /> */}
                </div>
            </div>
        </main>
    );
}
