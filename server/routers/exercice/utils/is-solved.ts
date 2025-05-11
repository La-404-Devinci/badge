import { and } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { submission } from "@/db/schema/submissions";

export const isSolved = async (userId: string, exerciceId: string) => {
    const solved = await db.query.submission.findFirst({
        where: and(
            eq(submission.userId, userId),
            eq(submission.exerciceId, exerciceId),
            eq(submission.isCorrect, true)
        ),
    });

    return solved !== null;
};
