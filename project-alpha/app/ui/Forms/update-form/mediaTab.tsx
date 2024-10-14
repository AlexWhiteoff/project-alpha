import { useEffect, useState } from "react";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { editPodcast } from "@/app/lib/actions/mainActions";
import { Podcast } from "@/app/lib/definitions";
import ImageInput from "../../imageInput";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";

const MediaTab = ({ podcast }: { podcast: Podcast }) => {
    const [state, dispatch] = useFormState(editPodcast, undefined);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);

    const [formChanged, setFormChanged] = useState(false);

    const [formData, setFormData] = useState({
        avatar: null,
        banner: null,
    });

    const handleInputChange = (name: string, value: File) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        setFormChanged(true);
    };

    useEffect(() => {
        avatar && handleInputChange("avatar", avatar);
    }, [avatar]);

    useEffect(() => {
        banner && handleInputChange("banner", banner);
    }, [banner]);

    const handleCancel = () => {
        setFormData({
            avatar: null,
            banner: null,
        });
        setAvatar(null);
        setBanner(null);
        setFormChanged(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData();
        data.set("id", podcast.id);
        data.set("action", "update-media");
        formData.avatar && data.set("avatar", formData.avatar);
        formData.banner && data.set("banner", formData.banner);

        dispatch(data);
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} method="POST" className="w-full">
            <div aria-describedby="form-error" className="flex w-full flex-col gap-3">
                {/* Podcast Cover Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="avatar" className="block text-sm font-medium text-neutral-400">
                        Обкладинка
                    </label>
                    <ImageInput
                        format="square"
                        name="avatar"
                        id="avatar"
                        value={`/assets/podcasts/${podcast.id}/${podcast.avatar_url}`}
                        setValue={setAvatar}
                        className="peer w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="cover-image-error" aria-live="polite" aria-atomic="true">
                        {state?.errors &&
                            "avatar" in state?.errors &&
                            state?.errors?.avatar &&
                            state.errors.avatar.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Podcast Banner Image */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="banner" className="block text-sm font-medium text-neutral-400">
                        Банер
                    </label>
                    <ImageInput
                        format="landscape"
                        name="banner"
                        id="banner"
                        value={`/assets/podcasts/${podcast.id}/${podcast.banner_url}`}
                        setValue={setBanner}
                        className="peer w-full lg:w-32 text-neutral-400"
                    >
                        <CloudArrowDownIcon className="w-6" />
                        <p className="text-sm text-center">Натисніть або перетягніть зображення</p>
                    </ImageInput>
                    <div id="banner-image-error" aria-live="polite" aria-atomic="true">
                        {state?.errors &&
                            "banner" in state?.errors &&
                            state?.errors?.banner &&
                            state.errors.banner.map((error: string) => (
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

export default MediaTab;
