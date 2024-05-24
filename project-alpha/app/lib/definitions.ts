// This file contains type definitions for data.
// It describes the shape of the data, and what data type each property should accept.

import { z } from "zod";

export const SignupFormSchema = z.object({
    email: z
        .string()
        .email({ message: "This email is invalid. Make sure it's written like example@email.com." })
        .trim(),
    password: z
        .string()
        .min(8, { message: "Contain at least 8 characters." })
        .regex(/[a-zA-z]/, { message: "Contain at least 1 letter." })
        .regex(/[^a-zA-Z\s]/, { message: "Contain at least 1 number or special character." })
        .trim(),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }).trim(),
    birthday_day: z
        .number()
        .gt(0, { message: "Please enter the day of your birth date as a number between 1 and 31." })
        .lt(32, { message: "Please enter the day of your birth date as a number between 1 and 31." }),
    birthday_month: z
        .number({ message: "Select your birth month." })
        .gt(0, { message: "Select your birth month." })
        .lt(13, { message: "Select your birth month." }),
    birthday_year: z
        .number()
        .gt(1900, { message: "Please enter the year of your birth date using four digits (e.g., 1990)." })
        .lte(new Date().getFullYear() - 16, { message: "You’re too young to create an account." }),
    gender: z.enum(["male", "female", "non_binary", "something_else", "prefer_not_to_say", "other"], {
        message: "Select your gender.",
    }),
});

export const SigninFormSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(8).trim(),
});

export type FormState =
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
};

export type User = {
    id: string;
    email: string;
    password: string;
    username: string;
    birthday_date: string;
    gender: string;
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
    is_active: string;
    comments_enabled: string;
    access_token: string;
    status: string;
    age_rating: string;
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
