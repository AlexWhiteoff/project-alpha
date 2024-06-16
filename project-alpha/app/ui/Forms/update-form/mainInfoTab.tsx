import { useState } from "react";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { editPodcast } from "@/app/lib/actions/mainActions";
import { Podcast } from "@/app/lib/definitions";

const MainInfoTab = ({ podcast }: { podcast: Podcast }) => {
    const [state, dispatch] = useFormState(editPodcast, undefined);
    const [formChanged, setFormChanged] = useState(false);

    const [formData, setFormData] = useState({
        title: podcast.title,
        description: podcast.description,
        age_rating: podcast.age_rating,
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setFormChanged(true);
    };

    const handleCancel = () => {
        setFormData({
            title: podcast.title,
            description: podcast.description,
            age_rating: podcast.age_rating,
        });
        setFormChanged(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData();
        data.set("id", podcast.id);
        data.set("action", "update-main-data");
        data.set("title", formData.title);
        data.set("description", formData.description);
        data.set("age_rating", formData.age_rating);

        dispatch(data);
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} method="POST" className="w-full">
            <div aria-describedby="form-error" className="flex w-full flex-col gap-3">
                {/* Title */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-400">
                        Назва
                    </label>
                    <input
                        id="title"
                        name="title"
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        required
                        defaultValue={podcast.title}
                        onChange={handleInputChange}
                    />
                    <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.title &&
                            state.errors.title.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-400">
                        Опис
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="peer block w-full h-24 rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        required
                        onChange={handleInputChange}
                        defaultValue={podcast.description}
                    />
                    <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Age Rating */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="age_rating" className="block text-sm font-medium text-neutral-400">
                        Віковий рейтинг
                    </label>
                    <select
                        className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                        name="age_rating"
                        id="age_rating"
                        required
                        onChange={handleInputChange}
                        defaultValue={podcast.age_rating}
                    >
                        <option value="" disabled className="text-white">
                            Виберіть віковий рейтинг
                        </option>
                        <option value="0" className="text-white">
                            Немає
                        </option>
                        <option value="6+" className="text-white">
                            6+
                        </option>
                        <option value="12+" className="text-white">
                            12+
                        </option>
                        <option value="16+" className="text-white">
                            16+
                        </option>
                        <option value="18+" className="text-white">
                            18+
                        </option>
                    </select>
                    <div id="age_rating-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.age_rating &&
                            state.errors.age_rating.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button
                    type="reset"
                    onClick={handleCancel}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Відмінити
                </button>
                <Button type="submit" disabled={!formChanged} aria-disabled={!formChanged}>
                    Зберегти
                </Button>
            </div>
        </form>
    );
};

export default MainInfoTab;
