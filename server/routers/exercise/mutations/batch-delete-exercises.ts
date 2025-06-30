import { inArray } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { BatchDeleteExercisesInput, InputMutationContext } from "./types";

export const batchDeleteExercises = async ({
    input,
    db,
}: InputMutationContext<BatchDeleteExercisesInput>) => {
    // Delete multiple exercises
    const result = await db
        .delete(exercise)
        .where(inArray(exercise.id, input.ids))
        .returning({ id: exercise.id });

    // Return success with deleted ids
    return {
        success: true,
        count: result.length,
        ids: result.map((item) => item.id),
    };
};
