import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { submission } from "@/db/schema/submissions";

export const isSolved = async (userId: string, exerciseId: string) => {
    const solved = await db.query.submission.findFirst({
        where: and(
            eq(submission.userId, userId),
            eq(submission.exerciseId, exerciseId),
            eq(submission.isCorrect, true)
        ),
    });

    return solved !== null;
};
