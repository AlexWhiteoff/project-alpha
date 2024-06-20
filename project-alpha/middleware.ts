import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/jwtEncoding";
import { updateSession } from "./app/lib/actions/session";
// import NextAuth from "next-auth";
// import { authConfig } from "@/auth.config";

// export default NextAuth(authConfig).auth;

const protectedRoutes = ["/p"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
    await updateSession(req);

    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get("session")?.value;
    if (!cookie && isProtectedRoute) return NextResponse.redirect(new URL("/login", req.nextUrl));
    if (!cookie) return;

    const session = await decrypt(cookie);

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith("/p")) {
        return NextResponse.redirect(new URL("/p", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
