import { getSession } from "@/app/lib/actions/session";

export default async function Page() {
    const session = await getSession();
    const userRole = session?.role;

    if (userRole === "admin") {
        return <AdminDashboard />; // Component for admin users
    } else if (userRole === "content_creator") {
        return <CreatorDashboard />; // Component for regular users
    } else {
        return <AccessDenied />; // Component shown for unauthorized access
    }
}
