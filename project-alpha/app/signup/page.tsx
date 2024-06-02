import SignupForm from "@/app/ui/Forms/signup-form";

export default function Page() {
    return (
        <main className="flex justify-center md:h-screen">
            <div className="relative w-[600px] flex flex-col space-y-2.5 p-4">
                <SignupForm />
            </div>
        </main>
    );
}
