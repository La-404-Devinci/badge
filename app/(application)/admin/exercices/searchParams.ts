import {
    createSearchParamsCache,
    parseAsString,
    parseAsInteger,
    parseAsStringEnum,
} from "nuqs/server";

const sortableColumns = ["title", "status", "difficulty", "createdAt"];

export type SortableColumn = "title" | "status" | "difficulty" | "createdAt";

export const adminExercicesParsers = {
    // Filters
    search: parseAsString,
    status: parseAsStringEnum([
        "draft",
        "published",
        "archived",
        "unarchived",
    ]).withDefault("unarchived"),
    difficulty: parseAsStringEnum([
        "easy",
        "medium",
        "hard",
        "unknown",
        "all",
    ]).withDefault("all"),

    // Pagination
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(25),

    // Sorting
    sortBy: parseAsStringEnum(sortableColumns).withDefault("createdAt"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
};

export const adminExercicesSearchParamsCache = createSearchParamsCache(
    adminExercicesParsers
);
