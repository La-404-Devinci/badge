import { and, asc, count, desc, eq, like, ne, or } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { InputQueryContext, listAdminExercicesInput } from "./types";

export const listAdminExercices = async ({
    input,
    db,
}: InputQueryContext<listAdminExercicesInput>) => {
    // Build database filters for exercices
    const exerciceFilters = [];

    if (input.search) {
        exerciceFilters.push(
            or(
                like(exercice.title, `%${input.search}%`),
                like(exercice.description, `%${input.search}%`)
            )
        );
    }

    if (input.status && input.status !== "unarchived") {
        exerciceFilters.push(eq(exercice.status, input.status));
    } else {
        exerciceFilters.push(ne(exercice.status, "archived"));
    }

    if (input.difficulty && input.difficulty !== "all") {
        exerciceFilters.push(eq(exercice.difficulty, input.difficulty));
    }

    const getOrderByConfig = () => {
        const sortDirection = input.sortOrder === "asc" ? asc : desc;

        switch (input.sortBy) {
            case "title":
                return sortDirection(exercice.title);
            case "status":
                return sortDirection(exercice.status);
            case "difficulty":
                return sortDirection(exercice.difficulty);
            default:
                return sortDirection(exercice.createdAt);
        }
    };

    // Get exercices
    const exercices = await db.query.exercice.findMany({
        where: exerciceFilters.length > 0 ? and(...exerciceFilters) : undefined,
        offset: (input.page - 1) * input.limit,
        limit: input.limit,
        orderBy: getOrderByConfig(),
    });

    // Get total count of exercices
    const totalCount = (
        await db
            .select({ count: count() })
            .from(exercice)
            .where(
                exerciceFilters.length > 0 ? and(...exerciceFilters) : undefined
            )
    )[0].count;

    return {
        exercices,
        pagination: {
            total: totalCount,
            totalPages: Math.ceil(totalCount / input.limit),
            hasNextPage: input.page < Math.ceil(totalCount / input.limit),
            hasPreviousPage: input.page > 1,
        },
    };
};
