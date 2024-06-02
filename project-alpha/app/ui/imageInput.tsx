import clsx from "clsx";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode;
    format: "square" | "landscape";
    setValue: React.Dispatch<React.SetStateAction<File | null>>;
}

export default function ImageInput({ children, format, setValue, className, ...rest }: InputProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
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
    }, []);
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
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
                <input accept=".jpeg, .jpg, .png" {...getInputProps()} {...rest} />
                {children}
            </div>
            <div className={`flex flex-col ${format === "landscape" ? "w-full lg:w-1/2" : "md:w-1/2"} justify-center`}>
                {preview && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm text-neutral-400">Прев&apos;ю</p>
                        <Image
                            src={preview}
                            alt="preview"
                            className="rounded-md h-[150px] object-cover"
                            width={format === "square" ? 150 : 350}
                            height={150}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
