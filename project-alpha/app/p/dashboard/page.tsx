import { getSession } from "@/app/lib/actions/session";
import AccessDenied from "@/app/ui/accessDenied";
import AdminDashboard from "@/app/ui/Dashboard/adminDashboard";

export default async function Page({
    searchParams,
}: {
    searchParams: {
        query?: string;
        tab?: string;
        page?: number;
    };
}) {
    const query = searchParams.query || "";
    const tab = searchParams.tab || "";
    const currentPage = searchParams?.page || 1;

    const session = await getSession();
    const userRole = session?.role;

    if (userRole === "admin") {
        return <AdminDashboard currTab={tab} query={query} currentPage={currentPage} />;
    } else {
        return <AccessDenied />;
    }
}
