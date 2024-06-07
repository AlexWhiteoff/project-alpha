import Image from "next/image";
import { UpdateEpisode, DeleteEpisode } from "@/app/ui/Episodes/buttons";
import { fetchFilteredEpisodes } from "@/app/lib/data";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/24/solid";

export default async function InvoicesTable({
    podcastId,
    query,
}: {
    podcastId: string;
    query: string;
}) {
    const episodes = await fetchFilteredEpisodes(podcastId, query);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="">
                        {episodes?.map((episode) => (
                            <Link
                                className="relative hover:bg-gray-300 p-2 flex flex-row items-center gap-4 z-0"
                                key={episode.id}
                                href={"/episode/" + episode.id}
                            >
                                <div>
                                    <div className="w-[100px] h-[100px] rounded overflow-hidden">
                                        <Image
                                            alt={episode.title}
                                            src={`/assets/podcasts/${episode.podcast_id}/${episode.image_url}`}
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-950 font-bold">{episode.title}</div>
                                    <div className="text-gray-950 h-12 text-ellipsis overflow-hidden">
                                        {episode.description}
                                    </div>
                                    <div className="text-sm text-gray-950 font-bold">{episode.release_date}</div>
                                    <div>
                                        <div></div>
                                        <button className="relative w-8 h-8 flex justify-center items-center rounded-full z-10">
                                            <PlayIcon className="w-8 h-8 hover:text-gray-50 text-gray-950" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Customer
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Amount
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Status
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {episodes?.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={invoice.image_url}
                                                className="rounded-full"
                                                width={28}
                                                height={28}
                                                alt={`${invoice.name}'s profile picture`}
                                            />
                                            <p>{invoice.name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">{invoice.email}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatCurrency(invoice.amount)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">{formatDateToLocal(invoice.date)}</td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <InvoiceStatus status={invoice.status} />
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateInvoice id={invoice.id} />
                                            <DeleteInvoice id={invoice.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>
    );
}
