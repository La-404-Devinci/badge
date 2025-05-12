import { inArray } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { BatchUpdateExerciseStatusInput, InputMutationContext } from "./types";

export const batchUpdateExerciseStatus = async ({
    input,
    db,
}: InputMutationContext<BatchUpdateExerciseStatusInput>) => {
    // Update multiple exercises status
    const result = await db
        .update(exercise)
        .set({
            status: input.status,
            updatedAt: new Date(),
        })
        .where(inArray(exercise.id, input.ids))
        .returning({ id: exercise.id });

    // Return success with updated ids
    return {
        success: true,
        count: result.length,
        ids: result.map((item) => item.id),
    };
};
