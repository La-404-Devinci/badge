import { eq } from "drizzle-orm";

import { exercise } from "@/db/schema";

import { generateOutputs } from "./generate-outputs";
import { InputMutationContext } from "./types";

export const updateExerciseStatus = async ({
    input,
    db,
}: InputMutationContext<{
    id: string;
    status: "draft" | "published" | "archived";
}>) => {
    const { id, status } = input;

    // If publishing, first fetch the exercise to generate outputs
    if (status === "published") {
        const exerciseToPublish = await db.query.exercise.findFirst({
            where: eq(exercise.id, id),
            columns: {
                response: true,
                exampleInputs: true,
                validationInputs: true,
            },
        });

        if (!exerciseToPublish) {
            throw new Error("Exercise not found");
        }

        // Generate outputs
        const { exampleOutputs, validationOutputs } = await generateOutputs({
            input: {
                id,
                response: exerciseToPublish.response,
                exampleInputs: exerciseToPublish.exampleInputs,
                validationInputs: exerciseToPublish.validationInputs,
            },
            db,
        });

        // Update exercise with outputs and status
        const result = await db
            .update(exercise)
            .set({
                status,
                exampleOutputs,
                validationOutputs,
                updatedAt: new Date(),
            })
            .where(eq(exercise.id, id))
            .returning({ id: exercise.id });

        if (result.length === 0) {
            throw new Error("Exercise not found");
        }

        return { success: true, id: result[0].id };
    }

    // For non-publish status updates
    const result = await db
        .update(exercise)
        .set({
            status,
            updatedAt: new Date(),
        })
        .where(eq(exercise.id, id))
        .returning({ id: exercise.id });

    if (result.length === 0) {
        throw new Error("Exercise not found");
    }

    return { success: true, id: result[0].id };
};
