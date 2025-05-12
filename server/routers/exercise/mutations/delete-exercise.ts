import { eq } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { DeleteExerciseInput, InputMutationContext } from "./types";

export const deleteExercise = async ({
    input,
    db,
}: InputMutationContext<DeleteExerciseInput>) => {
    // Delete exercise
    const result = await db
        .delete(exercise)
        .where(eq(exercise.id, input.id))
        .returning({ id: exercise.id });

    if (result.length === 0) {
        throw new Error("Exercise not found");
    }

    return { success: true, id: result[0].id };
};
