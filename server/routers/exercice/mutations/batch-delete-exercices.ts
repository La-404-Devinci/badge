import { inArray } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { BatchDeleteExercicesInput, InputMutationContext } from "./types";

export const batchDeleteExercices = async ({
    input,
    db,
}: InputMutationContext<BatchDeleteExercicesInput>) => {
    // Delete multiple exercices
    const result = await db
        .delete(exercice)
        .where(inArray(exercice.id, input.ids))
        .returning({ id: exercice.id });

    // Return success with deleted ids
    return {
        success: true,
        count: result.length,
        ids: result.map((item) => item.id),
    };
};
