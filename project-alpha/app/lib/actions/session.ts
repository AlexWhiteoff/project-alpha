"use server";

import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/app/lib/jwtEncoding";
import { NextRequest, NextResponse } from "next/server";

export async function createSession(
    userId: string,
    role: "admin" | "content_creator" | "user",
    name: string,
    avatar_url: string | null | undefined
) {
    const session = await encrypt({ userId, role });

    const expires = new Date(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    cookies().set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(req: NextRequest) {
    const session = req.cookies.get("session")?.value;

    if (!session) return;

    const payload = await decrypt(session);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(payload),
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        expires: expires,
    });

    return res;
}

export async function deleteSession() {
    await cookies().delete("session");
}
