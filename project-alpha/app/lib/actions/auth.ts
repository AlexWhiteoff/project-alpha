"use server";

import { SignupFormSchema, FormState, SigninFormSchema } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "@/app/lib/actions/session";
import { getUserByEmail } from "../data";
import { error } from "console";
// import { signIn } from "@/auth";

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
        birthday_day: Number(formData.get("birthday_day")),
        birthday_month: Number(formData.get("birthday_month")),
        birthday_year: Number(formData.get("birthday_year")),
        gender: formData.get("gender"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create User.",
        };
    }

    const { email, password, username, birthday_day, birthday_month, birthday_year, gender } = validatedFields.data;

    const user = await getUserByEmail(email);
    if (user) {
        return {
            errors: email,
            message: "This email address already in use.",
        };
    }

    const birthday_date = `${birthday_year}-${birthday_month}-${birthday_day}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await sql`
        INSERT INTO users (email, password, username, birthday_date, gender)
        VALUES (${email}, ${hashedPassword}, ${username}, ${birthday_date}, ${gender})
        RETURNING id, role;
        `;

        const user = result.rows[0];

        console.log(user);

        if (!user) {
            return {
                message: "An error occurred while creating your account.",
            };
        }

        await createSession(user.id, user.role as "user" | "admin" | "content_creator", username, null);
    } catch (error) {
        return {
            message: "Database Error: Failed to create user.",
            error: error,
        };
    }

    revalidatePath("/");
    redirect("/p/");
}

export async function signIn(state: { message: string } | undefined, formData: FormData) {
    const validatedFields = SigninFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            message: "Invalid credentials.",
        };
    }

    const { email, password } = validatedFields.data;

    const user = await getUserByEmail(email);

    if (!user) {
        return {
            message: "Something went wrong.",
        };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) await createSession(user.id, user.role, user.username, user.avatar_url);
    else
        return {
            message: "Invalid credentials.",
        };

    revalidatePath("/");
    redirect("/p/");
}

export async function signOut() {
    await deleteSession();
    revalidatePath("/");
    redirect("/");
}
