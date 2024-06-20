/*
 * This script is responsible for seeding the vercel database.
 *
 * To seed the database, follow these steps:
 *
 * 1. Install the required dependencies using the command: npm install.
 * 2. Configure the database connection parameters in the .env file.
 * 3. Run the script using the command: npm run seed.
 */

const { db } = require("@vercel/postgres");

async function seedUsers(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "users" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                username TEXT NOT NULL,
                birthday_date DATE NOT NULL,
                gender VARCHAR(25) NOT NULL,
                avatar_url TEXT,
                banner_url TEXT,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `;

        console.log(`Created "users" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding users:", error);
        throw error;
    }
}

async function seedPodcasts(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "podcasts" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS podcasts (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                avatar_url TEXT,
                banner_url TEXT,
                author_id UUID,
                is_active BOOLEAN DEFAULT TRUE,
                status VARCHAR(20) DEFAULT 'pending',
                age_rating VARCHAR(20) DEFAULT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
            );
        `;

        console.log(`Created "podcasts" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding podcasts:", error);
        throw error;
    }
}

async function seedCategories(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "categories" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS categories (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE
            );
        `;

        console.log(`Created "categories" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding categories:", error);
        throw error;
    }
}

async function seedTags(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "categories" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS tags (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE
            );
        `;

        console.log(`Created "tags" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding tags:", error);
        throw error;
    }
}

async function seedPodcastCategories(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "podcastCategories " table if it doesn't exist
        const createTable = await client.sql`
                CREATE TABLE IF NOT EXISTS podcastCategories (
                    podcast_id UUID,
                    category_id UUID,
                    PRIMARY KEY (podcast_id, category_id),
                    FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
                );
        `;

        console.log(`Created "podcastCategories" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding podcastCategories:", error);
        throw error;
    }
}

async function seedPodcastTags(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "podcastTags" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS podcastTags (
                podcast_id UUID,
                tag_id UUID,
                PRIMARY KEY (podcast_id, tag_id),
                FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
            );
        `;

        console.log(`Created "podcastTags" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding podcastTags:", error);
        throw error;
    }
}

async function seedEpisodes(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "episodes" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS episodes (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                podcast_id UUID NOT NULL,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                audio_url TEXT NOT NULL,
                image_url TEXT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE
            );
        `;

        console.log(`Created "episodes" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding episodes:", error);
        throw error;
    }
}

async function seedBookmarks(client) {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

        // Create the "bookmarks" table if it doesn't exist
        const createTable = await client.sql`
            CREATE TABLE IF NOT EXISTS bookmarks (
                user_id UUID NOT NULL,
                podcast_id UUID NOT NULL,
                list_type VARCHAR(50) NOT NULL DEFAULT 'listening',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY (user_id, podcast_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE
            );
        `;

        console.log(`Created "bookmarks" table`);

        return {
            createTable,
        };
    } catch (error) {
        console.error("Error seeding bookmarks:", error);
        throw error;
    }
}

async function main() {
    const client = await db.connect();

    await seedUsers(client);
    await seedPodcasts(client);
    await seedCategories(client);
    await seedTags(client);
    await seedPodcastCategories(client);
    await seedPodcastTags(client);
    await seedEpisodes(client);
    await seedBookmarks(client);

    await client.end();
}

main().catch((err) => {
    console.error("An error occurred while attempting to seed the database:", err);
});
