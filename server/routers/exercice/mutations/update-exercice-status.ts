import { eq } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { InputMutationContext, UpdateExerciceStatusInput } from "./types";

export const updateExerciceStatus = async ({
    input,
    db,
}: InputMutationContext<UpdateExerciceStatusInput>) => {
    // Update exercice status
    const result = await db
        .update(exercice)
        .set({
            status: input.status,
            updatedAt: new Date(),
        })
        .where(eq(exercice.id, input.id))
        .returning();

    if (result.length === 0) {
        throw new Error("Exercice not found");
    }

    return result[0];
};
