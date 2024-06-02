import { getSession } from "@/app/lib/actions/session";
import { fetchCategories, fetchTags } from "@/app/lib/data";
import PodcastCreateForm from "@/app/ui/Forms/podcast-create-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Створення подкасту",
};

export default async function Page() {
    await getSession().then((session) => {
        if (!session) {
            return redirect("/");
        } else if (session.role === "user") {
            return redirect("/p/");
        }
    });

    const [categories, tags] = await Promise.all([fetchCategories(), fetchTags()]);

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto bg-neutral-800 p-4">
                <div className="flex w-full">
                    <h1 className="font-medium text-xl text-neutral-300">Створення нового подкасту</h1>
                </div>
                <div>
                    <PodcastCreateForm categories={categories} tags={tags} />
                </div>
            </div>
        </main>
    );
}
