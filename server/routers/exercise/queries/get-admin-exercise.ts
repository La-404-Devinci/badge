import { eq } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { InputQueryContext, getAdminExerciseInput } from "./types";

export const getAdminExercise = async ({
    input,
    db,
}: InputQueryContext<getAdminExerciseInput>) => {
    // Get exercise by ID
    const result = await db.query.exercise.findFirst({
        where: eq(exercise.id, input.id),
    });

    if (!result) {
        throw new Error(`Exercise with ID ${input.id} not found`);
    }

    return result;
};
