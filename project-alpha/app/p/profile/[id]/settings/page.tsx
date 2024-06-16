import { getSession } from "@/app/lib/actions/session";
import { getUserById } from "@/app/lib/data";
import UserEditForm from "@/app/ui/Forms/userEditForm";
import AccessDenied from "@/app/ui/accessDenied";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Редагування профілю",
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [user, session] = await Promise.all([getUserById(id), getSession()]);

    if (!user) {
        notFound();
    }

    if (!session) {
        redirect("/");
    }

    if (session.userId !== id && session.role !== "admin") {
        return <AccessDenied />;
    }

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto bg-neutral-800 p-4">
                <div className="flex w-full">
                    <h1 className="font-medium text-xl text-neutral-300">Редагування користувача</h1>
                </div>
                <div>
                    <UserEditForm user={user} sesion_role={session.role} />
                </div>
            </div>
        </main>
    );
}
