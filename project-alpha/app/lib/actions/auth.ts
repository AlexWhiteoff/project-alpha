"use server";

import { SignupFormSchema, UserFormState, SigninFormSchema } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createSession, deleteSession } from "@/app/lib/actions/session";
import { getUserByEmail } from "@/app/lib/data";

export async function signUp(state: UserFormState, formData: FormData) {
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
            errors: {
                email: ["Ця електронна адреса вже використовується."],
            },
            message: "Failed to Create User.",
        };
    }

    const birthday_date = `${birthday_year}-${birthday_month}-${birthday_day}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await sql`
        INSERT INTO users (email, password, username, birthday_date, gender)
        VALUES (${email.toLowerCase()}, ${hashedPassword}, ${username}, ${birthday_date}, ${gender})
        RETURNING id, role;
        `;

        const user = result.rows[0];

        if (!user) {
            return {
                message: "Під час створення вашого облікового запису виникла помилка.",
            };
        }

        await createSession({ userId: user.id, role: user.role, name: username, avatar_url: null });
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
            message: "Неправильний логін або пароль.",
        };
    }

    const { email, password } = validatedFields.data;

    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
        return {
            message: "Неправильний логін або пароль.",
        };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch)
        await createSession({ userId: user.id, role: user.role, name: user.username, avatar_url: user.avatar_url });
    else
        return {
            message: "Неправильний логін або пароль.",
        };

    revalidatePath("/");
    redirect("/p/");
}

export async function signOut() {
    await deleteSession();
    revalidatePath("/");
    redirect("/");
}
