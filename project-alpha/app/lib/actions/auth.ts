"use server";

import { SignupFormSchema, FormState, SigninFormSchema } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "@/app/lib/actions/session";
import { signIn } from "@/auth";

export async function signup(state: FormState, formData: FormData) {
    console.log(formData);
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
    const birthday_date = `${birthday_year}-${birthday_month}-${birthday_day}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await sql`
        INSERT INTO users (email, password, username, birthday_date, gender)
        VALUES (${email}, ${hashedPassword}, ${username}, ${birthday_date}, ${gender})
        RETURNING id, role;
        `;

        const user = result.rows[0];

        if (!user) {
            return {
                message: "An error occurred while creating your account.",
            };
        }
        const authData = new FormData();

        authData.append("email", email);
        authData.append("password", password);

        await authenticate(undefined, authData);
    } catch (error) {
        return {
            message: "Database Error: Failed to create user.",
            error: error,
        };
    }

    revalidatePath("/");
    redirect("/p/");
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
