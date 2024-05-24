import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtected = nextUrl.pathname.startsWith("/p");
            if (isOnProtected) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/p", nextUrl));
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
