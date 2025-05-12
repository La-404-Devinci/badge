import { eq } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { InputMutationContext, UpdateExerciseInput } from "./types";

export const updateExercise = async ({
    input,
    db,
}: InputMutationContext<UpdateExerciseInput>) => {
    const { id, ...updateData } = input;

    // Update exercise with provided fields
    const result = await db
        .update(exercise)
        .set({
            ...updateData,
            updatedAt: new Date(),
        })
        .where(eq(exercise.id, id))
        .returning();

    if (result.length === 0) {
        throw new Error("Exercise not found");
    }

    return result[0];
};
