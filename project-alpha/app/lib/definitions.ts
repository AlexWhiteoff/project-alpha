// This file contains type definitions for data.
// It describes the shape of the data, and what data type each property should accept.

import { string, z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const SignupFormSchema = z.object({
    email: z
        .string()
        .email({
            message:
                "Ця адреса електронної пошти недійсна. Переконайтеся, що вона вказана у форматі example@email.com.",
        })
        .trim(),
    password: z
        .string()
        .min(8, { message: "Містити щонайменше 8 символів." })
        .regex(/[a-zA-z]/, { message: "Містити принаймні 1 літеру." })
        .regex(/[^a-zA-Z\s]/, { message: "Містить принаймні 1 цифру або спеціальний символ." })
        .trim(),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }).trim(),
    birthday_day: z
        .number()
        .gt(0, { message: "Будь ласка, введіть день своєї дати народження у вигляді числа від 1 до 31." })
        .lt(32, { message: "Будь ласка, введіть день своєї дати народження у вигляді числа від 1 до 31." }),
    birthday_month: z
        .number({ message: "Оберіть місяць вашого народження." })
        .gt(0, { message: "Оберіть місяць вашого народження." })
        .lt(13, { message: "Оберіть місяць вашого народження." }),
    birthday_year: z
        .number()
        .gt(1900, {
            message: "Будь ласка, введіть рік своєї дати народження у форматі чотирьох цифр (наприклад, 1990).",
        })
        .lte(new Date().getFullYear() - 16, { message: "Ви занадто молоді, щоб створити обліковий запис." }),
    gender: z.enum(["male", "female", "non_binary", "something_else", "prefer_not_to_say", "other"], {
        message: "Оберіть вашу стать.",
    }),
});

export const SigninFormSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(8).trim(),
});

export const PodcastFormSchema = z.object({
    id: z.string(),
    title: z.string().min(2, { message: "Ім'я має містити щонайменше 2 символи." }).trim(),
    description: z.string().min(2, { message: "Опис має містити щонайменше 2 символи." }).trim(),
    avatar: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Максимальний розмір зображення - 5 МБ.`)

        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        ),
    banner: z
        .any()
        .nullable()
        .refine((file) => file === null || file?.size <= MAX_FILE_SIZE, `Максимальний розмір зображення - 5 МБ.`)
        .refine(
            (file) => file === null || ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        ),
    author_id: z.string(),
    is_active: z.boolean(),
    comments_enabled: z.boolean(),
    access_token: z.string(),
    status: z.enum(["pending", "announced", "ongoing", "published", "discontinued", "archived"], {
        message: "Оберіть статус.",
    }),
    age_rating: z.enum(["0", "6+", "12+", "16+", "18+"], { message: "Оберіть вікову категорію." }),
    created_at: z.string(),
    updated_at: z.string(),
    // categories: z.array(string(), { message: "Виберіть категорії зі списку." }),
    // tags: z.array(string(), { message: "Оберіть теги зі списку." }),
});

export type PodcastFormState =
    | {
          errors?: {
              title?: string[];
              description?: string[];
              avatar_url?: string[];
              banner_url?: string[];
              status?: string[];
              age_rating?: string[];
              categories?: string[];
              tags?: string[];
          };
          message?: string;
      }
    | undefined;

export type UserFormState =
    | {
          errors?: {
              email?: string[];
              password?: string[];
              username?: string[];
              birthday_day?: string[];
              birthday_month?: string[];
              birthday_year?: string[];
              gender?: string[];
          };
          message?: string;
      }
    | undefined;

export type SessionPayload = {
    userId: string;
    role: "admin" | "content_creator" | "user";
    name: string;
    avatar_url: string | null;
};

export type User = {
    id: string;
    email: string;
    password: string;
    username: string;
    birthday_date: string;
    gender: "male" | "female" | "non_binary" | "something_else" | "prefer_not_to_say" | "other";
    avatar_url: string;
    banner_url: string;
    role: "admin" | "content_creator" | "user";
    created_at: string;
    updated_at: string;
};

export type Podcast = {
    id: string;
    title: string;
    description: string;
    avatar_url: string;
    banner_url: string;
    author_id: string;
    is_active: boolean;
    comments_enabled: boolean;
    access_token: string;
    status: "pending" | "announced" | "ongoing" | "published" | "discontinued" | "archived";
    age_rating: "0" | "6+" | "12+" | "16+" | "18+";
    created_at: string;
    updated_at: string;
};

export type Episode = {
    id: string;
    podcast_id: string;
    title: string;
    description: string;
    audio_url: string;
    image_url: string;
    duration: number;
    release_date: string;
    episode_number: number;
    is_active: boolean;
    access_key: string;
    created_at: string;
    updated_at: string;
};

export type Categories = {
    id: string;
    name: string;
};

export type Tags = {
    id: string;
    name: string;
};

export type Bookmarks = {
    id: string;
    user_id: string;
    podcast_id: string;
    list_type: string;
    created_at: string;
    updated_at: string;
};

export type Ratings = {
    rating_id: string;
    user_id: string;
    podcast_id: string;
    rating: number;
    content: string;
    created_at: string;
};

export type Comments = {
    id: string;
    user_id: string;
    podcast_id: string;
    parent_comment_id?: string;
    content: string;
    created_at: string;
    updated_at: string;
};
