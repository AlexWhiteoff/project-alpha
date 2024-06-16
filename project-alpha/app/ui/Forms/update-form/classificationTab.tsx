import { useEffect, useState } from "react";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { editPodcast } from "@/app/lib/actions/mainActions";
import { Categories, Podcast, Tags } from "@/app/lib/definitions";
import MultipleSelect from "@/app/ui/multipleSelect";

const ClassificationTab = ({
    podcast,
    podcastCategories,
    podcastTags,
    categories,
    tags,
}: {
    podcast: Podcast;
    podcastCategories: Categories[];
    podcastTags: Tags[];
    categories: Categories[];
    tags: Tags[];
}) => {
    const initialCategories = podcastCategories.map((category) => category.name);
    const initialTags = podcastTags.map((tag) => tag.name);

    const [state, dispatch] = useFormState(editPodcast, undefined);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

    const [formChanged, setFormChanged] = useState(false);

    const [formData, setFormData] = useState({
        categories: initialCategories,
        tags: initialTags,
    });

    const handleInputChange = (name: string, value: string[]) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setFormChanged(true);
    };

    const handleCancel = () => {
        setFormData({
            categories: initialCategories,
            tags: initialTags,
        });

        setSelectedCategories(initialCategories);
        setSelectedTags(initialTags);

        setFormChanged(false);
    };

    useEffect(() => {
        handleInputChange("categories", selectedCategories);
    }, [selectedCategories]);

    useEffect(() => {
        handleInputChange("tags", selectedTags);
    }, [selectedTags]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData();
        data.set("id", podcast.id);
        data.set("action", "update-classification");
        data.set("categories", JSON.stringify(selectedCategories));
        data.set("tags", JSON.stringify(selectedTags));

        dispatch(data);
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} method="POST" className="w-full">
            <div aria-describedby="form-error" className="flex w-full flex-col gap-3">
                {/* Categories */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="categories" className="block text-sm font-medium text-neutral-400">
                        Категорії
                    </label>
                    <MultipleSelect
                        type="Категорії"
                        options={categories}
                        values={selectedCategories}
                        setValue={setSelectedCategories}
                    />
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="tags" className="block text-sm font-medium text-neutral-400">
                        Теги
                    </label>
                    <MultipleSelect type="Теги" options={tags} values={selectedTags} setValue={setSelectedTags} />
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

export default ClassificationTab;
