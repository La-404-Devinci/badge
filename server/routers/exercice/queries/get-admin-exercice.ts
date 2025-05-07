import { eq } from "drizzle-orm";

import { exercice } from "@/db/schema";

import { InputQueryContext, getAdminExerciceInput } from "./types";

export const getAdminExercice = async ({
    input,
    db,
}: InputQueryContext<getAdminExerciceInput>) => {
    // Get exercice by ID
    const result = await db.query.exercice.findFirst({
        where: eq(exercice.id, input.id),
    });

    if (!result) {
        throw new Error(`Exercice with ID ${input.id} not found`);
    }

    return result;
};
