// This file contains type definitions for data.
// It describes the shape of the data, and what data type each property should accept.

import { string, z } from "zod";

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5 MB
const MAX_AUDIO_SIZE = 1024 * 1024 * 150; // 150 MB
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const ACCEPTED_AUDIO_MIME_TYPES = ["audio/mp3", "audio/aac", "audio/wav", "audio/flac", "audio/ogg"];

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
    username: z.string().min(2, { message: "Ім'я повинно містити щонайменше 8 символів." }).trim(),
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

export const UserFormSchema = z.object({
    id: z.string(),
    email: z.string().trim(),
    password: z.string().trim(),
    username: z.string().min(2, { message: "Ім'я повинно містити щонайменше 8 символів." }).trim(),
    avatar: z
        .any()
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        )
        .optional(),
    banner: z
        .any()
        .refine((file) => file === null || file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)
        .refine(
            (file) => file === null || ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        )
        .optional(),
    birthday_day: z
        .number()
        .gt(0, { message: "Будь ласка, введіть день дати народження у вигляді числа від 1 до 31." })
        .lt(32, { message: "Будь ласка, введіть день дати народження у вигляді числа від 1 до 31." }),
    birthday_month: z
        .number({ message: "Оберіть місяць народження." })
        .gt(0, { message: "Оберіть місяць народження." })
        .lt(13, { message: "Оберіть місяць народження." }),
    birthday_year: z
        .number()
        .gt(1900, {
            message: "Будь ласка, введіть рік дати народження у форматі чотирьох цифр (наприклад, 1990).",
        })
        .lte(new Date().getFullYear() - 16, { message: "Користувач занадто молодий, щоб мати обліковий запис." }),
    gender: z.enum(["male", "female", "non_binary", "something_else", "prefer_not_to_say", "other"], {
        message: "Оберіть стать.",
    }),
    role: z
        .enum(["admin", "content_creator", "user"], {
            message: "Оберіть роль.",
        })
        .optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const PodcastFormSchema = z.object({
    id: z.string(),
    title: z.string().min(2, { message: "Назва має містити щонайменше 2 символи." }).trim(),
    description: z.string().min(2, { message: "Опис має містити щонайменше 2 символи." }).trim(),
    avatar: z
        .any()
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)

        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        ),
    banner: z
        .any()
        .nullable()
        .refine((file) => file === null || file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)
        .refine(
            (file) => file === null || ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        ),
    author_id: z.string(),
    is_active: z.boolean(),
    status: z.enum(["pending", "announced", "ongoing", "published", "discontinued", "archived"], {
        message: "Оберіть статус.",
    }),
    age_rating: z.enum(["0", "6+", "12+", "16+", "18+"], { message: "Оберіть вікову категорію." }),
    created_at: z.string(),
    updated_at: z.string(),
});

export const EpisodeFormSchema = z.object({
    id: z.string(),
    podcast_id: z.string(),
    title: z.string().min(2, { message: "Назва має містити щонайменше 2 символи." }).trim(),
    description: z.string().min(2, { message: "Опис має містити щонайменше 2 символи." }).trim(),
    audio: z
        .any()
        .refine((file) => file === null || file?.size <= MAX_AUDIO_SIZE, `Максимальний розмір файлу - 150 МБ.`)
        .refine(
            (file) => file === null || ACCEPTED_AUDIO_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .mp3, .aac, .wav, .flac та .ogg."
        ),
    image: z
        .any()
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        ),
    duration: z.number(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const EditEpisodeFormSchema = z.object({
    id: z.string(),
    podcast_id: z.string(),
    title: z.string().min(2, { message: "Назва має містити щонайменше 2 символи." }).trim(),
    description: z.string().min(2, { message: "Опис має містити щонайменше 2 символи." }).trim(),
    audio: z
        .any()
        .nullable()
        .refine((file) => file === null || file?.size <= MAX_AUDIO_SIZE, `Максимальний розмір файлу - 150 МБ.`)
        .refine(
            (file) => file === null || ACCEPTED_AUDIO_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .mp3, .aac, .wav, .flac та .ogg."
        )
        .optional(),
    image: z
        .any()
        .nullable()
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Максимальний розмір файлу - 5 МБ.`)
        .refine(
            (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
            "Підтримуються лише формати .jpg, .jpeg, .png та .gif."
        )
        .optional(),
    duration: z.number(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const addToBookmarkSchema = z.object({
    podcast_id: z.string(),
    user_id: z.string(),
    list_type: z.enum(["listening", "planned", "abandoned", "finished", "favorite"], {
        message: "Обраного списку не існує.",
    }),
    created_at: z.string(),
    updated_at: z.string(),
});

export type MainDataErrors = {
    title?: string[];
    description?: string[];
    age_rating?: string[];
};

export type MediaErrors = {
    avatar?: string[];
    banner?: string[];
};

export type ManagementErrors = {
    status?: string[];
    is_active?: string[];
};

export type PodcastFormState =
    | {
          errors?: MainDataErrors | MediaErrors | ManagementErrors;
          message?: string;
      }
    | undefined;

export type EpisodeFormState =
    | {
          errors?: {
              title?: string[];
              description?: string[];
              audio?: string[];
              image?: string[];
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
              avatar?: string[];
              banner?: string[];
              birthday_day?: string[];
              birthday_month?: string[];
              birthday_year?: string[];
              gender?: string[];
              role?: string[];
          };
          message?: string;
      }
    | undefined;

export type BookmarksFormState = { status?: string; errors?: { list_type?: string[] } } | undefined;

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
    status: "pending" | "announced" | "ongoing" | "published" | "discontinued";
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
    is_active: boolean;
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
    user_id: string;
    podcast_id: string;
    list_type: "listening" | "planned" | "abandoned" | "finished" | "favorite"; // Слухаю, Заплановані, Покинуті, Прослухано, Улюблені
    created_at: string;
    updated_at: string;
};

export interface ExtendedPodcast extends Podcast {
    episode_count: number;
    author_name: string;
}

export interface ExtendedEpisode extends Episode {
    author_name?: string;
    podcast_title: string;
}

export type PodcastsTableType = {
    id: string;
    title: string;
    avatar_url: string;
    author_id: string;
    author_name: string;
    is_active: boolean;
    status: "pending" | "announced" | "ongoing" | "published" | "discontinued";
    total_episodes: number;
    created_at: string;
    updated_at: string;
};

export type EpisodeTableType = {
    id: string;
    podcast_id: string;
    author_id: string;
    title: string;
    description: string;
    image_url: string;
    is_active: boolean;
    author_name: string;
    podcast_title: string;
    podcast_is_active: boolean;
    status: string;
    created_at: string;
    updated_at: string;
};

export type UserTableType = {
    id: string;
    email: string;
    username: string;
    birthday_date: string;
    gender: "male" | "female" | "non_binary" | "something_else" | "prefer_not_to_say" | "other";
    avatar_url: string;
    role: "admin" | "content_creator" | "user";
    created_at: string;
    updated_at: string;
};
