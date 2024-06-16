import { useState } from "react";
import { Button } from "@/app/ui/button";
import { useFormState } from "react-dom";
import { editPodcast } from "@/app/lib/actions/mainActions";
import { Podcast } from "@/app/lib/definitions";

const ManagementTab = ({
    podcast,
    user_role,
}: {
    podcast: Podcast;
    user_role: "admin" | "content_creator" | "user";
}) => {
    const [state, dispatch] = useFormState(editPodcast, undefined);
    const [isCommentsOn, setIsCommentsOn] = useState(podcast.comments_enabled);
    const [status, setStatus] = useState(podcast.status);
    const [isActive, setIsActive] = useState(podcast.is_active);
    const [formChanged, setFormChanged] = useState(false);

    const toggleComments = () => {
        setIsCommentsOn((prevState) => !prevState);
        setFormChanged(true);
    };

    const toggleActive = () => {
        setIsActive((prevState) => !prevState);
        setFormChanged(true);
    };

    const handleStatusChange = (status: Podcast["status"]) => {
        setStatus(status);
        setFormChanged(true);
    };

    const handleCancel = () => {
        setIsCommentsOn(podcast.comments_enabled);
        setIsActive(podcast.is_active);
        setStatus(podcast.status);
        setFormChanged(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData();
        data.set("id", podcast.id);
        data.set("action", "update-management");
        data.set("status", status);
        data.set("is_active", `${isActive}`);
        data.set("comments_enabled", `${isCommentsOn}`);

        dispatch(data);
    };

    return (
        <form onSubmit={(e) => handleSubmit(e)} method="POST" className="w-full">
            <div aria-describedby="form-error" className="flex w-full flex-col gap-3">
                {user_role === "admin" || podcast.status !== "pending" ? (
                    <div className="flex flex-row items-center justify-between">
                        <label htmlFor="is_active" className="block text-md font-medium text-neutral-300">
                            Зробити публічним
                        </label>
                        <div className="relative flex w-10 items-center select-none">
                            <input
                                type="checkbox"
                                className={`transition-all toggle-checkbox absolute block w-6 h-6 rounded-full bg-neutral-100 border-4 border-neutral-300 appearance-none cursor-pointer ${
                                    isActive ? "right-0" : "right-4"
                                }`}
                                name="is_active"
                                id="is_active"
                                onChange={toggleActive}
                                checked={isActive}
                            />
                            <label
                                htmlFor="is_active"
                                className={`transition-all toggle-label block overflow-hidden h-5 w-10 rounded-full cursor-pointer ${
                                    isActive ? "bg-blue-500" : "bg-neutral-500"
                                }`}
                            />
                        </div>
                    </div>
                ) : null}
                <div className="flex flex-row items-center justify-between">
                    <label htmlFor="categories" className="block text-md font-medium text-neutral-300">
                        Статус подкасту
                    </label>

                    <div>
                        <select
                            name="status"
                            id="status"
                            onChange={(e) => handleStatusChange(e.target.value as Podcast["status"])}
                            defaultValue={podcast.status}
                            required
                            className="peer block w-full rounded-md border border-neutral-500 py-2 px-4 text-sm text-white outline-2 bg-neutral-800"
                            disabled={user_role !== "admin" && podcast.status === "pending"}
                        >
                            <option value="pending" className="text-white">
                                Очікує перевірки
                            </option>
                            <option value="announced" className="text-white">
                                Анонсовано
                            </option>
                            <option value="ongoing" className="text-white">
                                Триває
                            </option>
                            <option value="published" className="text-white">
                                Опубліковано
                            </option>
                            <option value="discontinued" className="text-white">
                                Випуск закінчено
                            </option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <label htmlFor="comments_enabled" className="block text-md font-medium text-neutral-300">
                        Коментарі
                    </label>

                    <div className="relative flex w-10 items-center select-none">
                        <input
                            type="checkbox"
                            className={`transition-all toggle-checkbox absolute block w-6 h-6 rounded-full bg-neutral-100 border-4 border-neutral-300 appearance-none cursor-pointer ${
                                isCommentsOn ? "right-0" : "right-4"
                            }`}
                            name="comments_enabled"
                            id="comments_enabled"
                            onChange={toggleComments}
                            checked={isCommentsOn}
                        />
                        <label
                            htmlFor="comments_enabled"
                            className={`transition-all toggle-label block overflow-hidden h-5 w-10 rounded-full cursor-pointer ${
                                isCommentsOn ? "bg-blue-500" : "bg-neutral-500"
                            }`}
                        />
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

export default ManagementTab;