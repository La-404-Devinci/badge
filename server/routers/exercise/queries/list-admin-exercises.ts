import { and, asc, count, desc, eq, like, ne, or } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { InputQueryContext, listAdminExercisesInput } from "./types";

export const listAdminExercises = async ({
    input,
    db,
}: InputQueryContext<listAdminExercisesInput>) => {
    // Build database filters for exercises
    const exerciseFilters = [];

    if (input.search) {
        exerciseFilters.push(
            or(
                like(exercise.title, `%${input.search}%`),
                like(exercise.description, `%${input.search}%`)
            )
        );
    }

    if (input.status && input.status !== "unarchived") {
        exerciseFilters.push(eq(exercise.status, input.status));
    } else {
        exerciseFilters.push(ne(exercise.status, "archived"));
    }

    if (input.difficulty && input.difficulty !== "all") {
        exerciseFilters.push(eq(exercise.difficulty, input.difficulty));
    }

    const getOrderByConfig = () => {
        const sortDirection = input.sortOrder === "asc" ? asc : desc;

        switch (input.sortBy) {
            case "title":
                return sortDirection(exercise.title);
            case "status":
                return sortDirection(exercise.status);
            case "difficulty":
                return sortDirection(exercise.difficulty);
            default:
                return sortDirection(exercise.createdAt);
        }
    };

    // Get exercises
    const exercises = await db.query.exercise.findMany({
        where: exerciseFilters.length > 0 ? and(...exerciseFilters) : undefined,
        offset: (input.page - 1) * input.limit,
        limit: input.limit,
        orderBy: getOrderByConfig(),
    });

    // Get total count of exercises
    const totalCount = (
        await db
            .select({ count: count() })
            .from(exercise)
            .where(
                exerciseFilters.length > 0 ? and(...exerciseFilters) : undefined
            )
    )[0].count;

    return {
        exercises,
        pagination: {
            total: totalCount,
            totalPages: Math.ceil(totalCount / input.limit),
            hasNextPage: input.page < Math.ceil(totalCount / input.limit),
            hasPreviousPage: input.page > 1,
        },
    };
};
