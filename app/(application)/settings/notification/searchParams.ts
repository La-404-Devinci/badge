import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const tabParsers = {
    tab: parseAsString.withDefault("preferences"),
};

export const searchParamsCache = createSearchParamsCache(tabParsers);
