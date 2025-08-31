import {
    createSearchParamsCache,
    parseAsString,
    parseAsInteger,
    parseAsStringEnum,
} from "nuqs/server";

const sortableColumns = ["name", "displayName", "createdAt", "maxLevel"];

export type SortableColumn = "name" | "displayName" | "createdAt" | "maxLevel";

export const adminBadgesParsers = {
    // Filters
    search: parseAsString,
    type: parseAsString,
    color: parseAsString,

    // Pagination
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(20),

    // Sorting
    sortBy: parseAsStringEnum(sortableColumns).withDefault("createdAt"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
};

export const adminBadgesSearchParamsCache =
    createSearchParamsCache(adminBadgesParsers);
