import clsx from "clsx";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
    value?: string;
    setValue: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function AudioInput({ children, value, setValue, className, ...rest }: InputProps) {
    const [preview, setPreview] = useState<string | null>(value || null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();

                reader.onabort = () => console.log("file reading was aborted");
                reader.onerror = () => console.log("file reading has failed");
                reader.onload = () => {
                    setPreview(reader.result as string);
                    setValue(file);
                };
                reader.readAsDataURL(file);
            });
        },
        [setValue]
    );
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "audio/*": [".mp3", ".aac", ".wav", ".flac", ".ogg"],
        },
        multiple: false,
    });

    return (
        <div className="flex justify-between flex-wrap">
            <div
                {...getRootProps()}
                className={clsx(
                    "flex flex-col items-center justify-center border-dashed border-2 border-blue-600 rounded-md px-4 py-12",
                    className
                )}
            >
                <input type="file" accept=".mp3, .aac, .wav, .flac, .ogg" {...getInputProps()} {...rest} />
                {children}
            </div>
            <div className={`flex flex-col justify-center`}>
                {preview && (
                    <div className="flex flex-col items-center justify-center gap-2 my-2">
                        <p className="text-sm text-neutral-400">Прев&apos;ю</p>
                        <audio src={preview} controls />
                    </div>
                )}
            </div>
        </div>
    );
}
