// This file contains type definitions for data.
// It describes the shape of the data, and what data type each property should accept.

export type Podcast = {
    id: string;
    name: string;
    description: string;
    creator_id: string;
    image: string;
    created_at: string;
    brief: string;
    categories: string[];
    tags: string[];
    key_words: string[];
};

export type Episode = {
    id: string;
    podcast_id: string;
    title: string;
    description: string;
    src: string;
    image: string;
    duration: number; // in seconds
    release_date: string;
};
