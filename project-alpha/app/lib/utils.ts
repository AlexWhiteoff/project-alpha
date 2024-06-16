import fs from "fs";
import path from "path";

export const saveFile = async (file_path: string, podcastId: string, file: File) => {
    const fileBuffer = await file.arrayBuffer();

    const folderPath = path.join(process.cwd(), "public", "assets", "podcasts", podcastId, file_path);
    const newFolderPath = path.dirname(folderPath);

    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath, { recursive: true });
    }

    fs.writeFileSync(folderPath, Buffer.from(fileBuffer));
};

export const overwriteFile = async (relative_file_path: string, file: File) => {
    const avatarBuffer = await file.arrayBuffer();

    const filePath = path.join(process.cwd(), "public", relative_file_path);
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, Buffer.from(avatarBuffer));
};

export const removePodcastFiles = async (podcast_id: string) => {
    const folderPath = path.join(process.cwd(), "public", "assets", "podcasts", podcast_id);

    return new Promise<void>((resolve, reject) => {
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
