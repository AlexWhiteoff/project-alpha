import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface Options {
    id: string;
    name: string;
}

interface MultipleSelectProps {
    type: string;
    options: Options[];
    setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MultipleSelect({ type, options, setValue }: MultipleSelectProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [isDdOpen, setIsDdOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleChange = (option: string) => {
        setSelected((prevState) => {
            if (prevState.includes(option)) {
                return prevState.filter((item) => item !== option);
            } else {
                return [...prevState, option];
            }
        });
    };

    useEffect(() => {
        setValue(selected);
    }, [selected, setValue]);

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget as Node)) {
            setIsDdOpen(false);
        }
    };

    const handleRemove = (option: string) => {
        setSelected((prevState) => prevState.filter((item) => item !== option));
    };

    return (
        <div className="flex w-full rounded-md border border-neutral-500">
            <div className="flex flex-col md:flex-row gap-3 p-2">
                <div ref={dropdownRef} onBlur={handleBlur} className="relative">
                    <button
                        type="button"
                        className="transition-all flex gap-2 items-center justify-center border border-blue-600 p-2 rounded-md hover:bg-neutral-700 "
                        onFocus={() => setIsDdOpen((prevState) => !prevState)}
                    >
                        <PlusIcon className="w-6" />
                        <span className="text-sm text-nowrap">Додати {type}</span>
                    </button>
                    <div
                        className={`
                            ${
                                isDdOpen ? "flex" : "hidden"
                            } absolute z-30 flex-col w-64 h-96 p-2 bg-neutral-900 rounded-md`}
                    >
                        <ul className="overflow-y-auto" tabIndex={-1}>
                            {options.map((option) => (
                                <li
                                    key={option.name}
                                    className="transition-all flex items-center justify-start w-full px-4 py-2 rounded-md hover:bg-gray-100 hover:text-blue-600"
                                    onClick={() => handleChange(option.name)}
                                >
                                    <div
                                        className={`${
                                            selected.includes(option.name) ? "bg-blue-300" : ""
                                        } w-2 h-2 rounded-full mr-3`}
                                    ></div>
                                    {option.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex items-center flex-wrap gap-2 justify-start w-full">
                    {selected.map((option) => (
                        <div
                            className="transition-all flex items-center gap-2 border border-blue-600 px-2 py-1 rounded-md hover:bg-neutral-700"
                            key={option}
                        >
                            <span className="text-sm text-nowrap">{option}</span>
                            <button
                                type="button"
                                className="transition-all hover:text-blue-600"
                                onClick={() => handleRemove(option)}
                            >
                                <XMarkIcon className="w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
