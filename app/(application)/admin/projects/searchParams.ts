import {
    createSearchParamsCache,
    parseAsString,
    parseAsStringEnum,
    parseAsInteger,
} from "nuqs/server";

export const adminProjectsParsers = {
    // Filters
    search: parseAsString.withDefault(""),
    status: parseAsStringEnum([
        "all",
        "review",
        "active",
        "inactive",
        "completed",
        "cancelled",
    ]).withDefault("all"),
    type: parseAsStringEnum([
        "all",
        "uxui",
        "dev",
        "marketing",
        "other",
    ]).withDefault("all"),

    // Pagination
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
};

export const adminProjectsSearchParamsCache =
    createSearchParamsCache(adminProjectsParsers);
