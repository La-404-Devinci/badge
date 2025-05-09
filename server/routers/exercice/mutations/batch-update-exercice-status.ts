import { inArray } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { BatchUpdateExerciceStatusInput, InputMutationContext } from "./types";

export const batchUpdateExerciceStatus = async ({
    input,
    db,
}: InputMutationContext<BatchUpdateExerciceStatusInput>) => {
    // Update multiple exercices status
    const result = await db
        .update(exercice)
        .set({
            status: input.status,
            updatedAt: new Date(),
        })
        .where(inArray(exercice.id, input.ids))
        .returning({ id: exercice.id });

    // Return success with updated ids
    return {
        success: true,
        count: result.length,
        ids: result.map((item) => item.id),
    };
};
