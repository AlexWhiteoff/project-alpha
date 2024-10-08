export const formatDateToLocal = (dateStr: string, locale: string = "uk-UA") => {
    const date = new Date(dateStr);

    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
    };
    if (date.getFullYear() !== currentDate.getFullYear()) {
        options.year = "numeric";
    }
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
};
