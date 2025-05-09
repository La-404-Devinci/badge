import { eq } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { InputMutationContext, UpdateExerciceInput } from "./types";

export const updateExercice = async ({
    input,
    db,
}: InputMutationContext<UpdateExerciceInput>) => {
    const { id, ...updateData } = input;

    // Update exercice with provided fields
    const result = await db
        .update(exercice)
        .set({
            ...updateData,
            updatedAt: new Date(),
        })
        .where(eq(exercice.id, id))
        .returning();

    if (result.length === 0) {
        throw new Error("Exercice not found");
    }

    return result[0];
};
