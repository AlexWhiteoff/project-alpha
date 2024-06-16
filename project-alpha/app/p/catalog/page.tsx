import { fetchCategories, fetchTags, getFilteredPodcasts } from "@/app/lib/data";
import Catalog from "@/app/ui/catalog";

export default async function SearchPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        sort_by?: string;
        order?: string;
        categories?: string;
        tags?: string;
        year_max?: string;
        year_min?: string;
        episodes_max?: string;
        episodes_min?: string;
        age?: string;
        status?: string;
    };
}) {
    const query = searchParams?.query || "";
    const sort_by = searchParams?.sort_by || "title";
    const order = searchParams?.order || "DESC";

    const categoriesString = searchParams?.categories;
    const tagsString = searchParams?.tags;
    const ageString = searchParams?.age;
    const statusString = searchParams?.status;

    const categories = categoriesString ? categoriesString.split(",") : [];
    const tags = tagsString ? tagsString.split(",") : [];
    const age = ageString ? ageString.split(",") : [];
    const status = statusString ? statusString.split(",") : [];
    const year_max = searchParams?.year_max || "";
    const year_min = searchParams?.year_min || "";
    const episode_max = searchParams?.episodes_max || "";
    const episode_min = searchParams?.episodes_min || "";

    const [categoryList, tagList] = await Promise.all([fetchCategories(), fetchTags()]);

    const podcasts = await getFilteredPodcasts(
        query,
        sort_by,
        order,
        categories,
        tags,
        age,
        status,
        year_max,
        year_min,
        episode_max,
        episode_min
    );

    return (
        <main className="flex min-h-full justify-center">
            <div className="flex flex-col gap-4 max-w-[1168px] w-full md:rounded-lg overflow-y-auto">
                <Catalog
                    categories={categoryList}
                    tags={tagList}
                    podcasts={podcasts}
                    currSort={sort_by as "title" | "updated_at" | "created_at"}
                    currOrder={order as "ASC" | "DESC"}
                    filters={{
                        categories: categories,
                        tags: tags,
                        age: age,
                        status: status,
                        year_max: year_max,
                        year_min: year_min,
                        episode_max: episode_max,
                        episode_min: episode_min,
                    }}
                />
            </div>
        </main>
    );
}
