import { eq } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { DeleteExerciceInput, InputMutationContext } from "./types";

export const deleteExercice = async ({
    input,
    db,
}: InputMutationContext<DeleteExerciceInput>) => {
    // Delete exercice
    const result = await db
        .delete(exercice)
        .where(eq(exercice.id, input.id))
        .returning({ id: exercice.id });

    if (result.length === 0) {
        throw new Error("Exercice not found");
    }

    return { success: true, id: result[0].id };
};
