import { Podcast } from "@/app/lib/definitions";
import Image from "next/image";
import Link from "next/link";

const Card = ({ podcast }: { podcast: Podcast }) => {
    return (
        <Link href={"/podcast/" + podcast.id} className="hover:bg-gray-300 p-2">
            <div className="flex flex-col gap-2 w-36 md:w-48">
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-md overflow-hidden">
                    <Image
                        src={podcast.image}
                        className="object-cover h-[100%]"
                        alt={podcast.name}
                        width={200}
                        height={200}
                    />
                </div>
                <div>
                    <h3 className="font-bold text-ellipsis overflow-hidden text-nowrap">{podcast.name}</h3>
                </div>
                <div>
                    <p className="text-ellipsis overflow-hidden text-sm">{podcast.brief}</p>
                </div>
            </div>
        </Link>
    );
};

export default Card;
