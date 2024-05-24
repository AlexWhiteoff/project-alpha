import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import PodcastProvider from "@/app/utils/provider/podcastProvider";

export const metadata: Metadata = {
    title: {
        template: "%s | Project Alpha",
        default: "Project Alpha",
    },
    description: "Project Alpha. Новий стандарт для прослуховування подкастів",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <PodcastProvider>
                <html lang="en">
                    <body className={`${inter.className} antialiased flex flex-col h-screen overflow-hidden`}>
                        {children}
                    </body>
                </html>
        </PodcastProvider>
    );
}
