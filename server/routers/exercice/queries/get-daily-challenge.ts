import { format } from "date-fns";
import { and, eq } from "drizzle-orm";

import { Database } from "@/db";
import { exercice } from "@/db/schema/exercices";

/**
 * Gets the daily challenge for today
 */
export const getDailyChallenge = async ({ db }: { db: Database }) => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");

    console.log("formattedDate", formattedDate);

    const dailyChallenge = await db.query.exercice.findFirst({
        where: and(
            eq(exercice.dailyChallengeDate, formattedDate),
            eq(exercice.status, "published")
        ),
        columns: {
            id: true,
            title: true,
            description: true,
            problem: true,
            exampleInputs: true,
            difficulty: true,
        },
    });

    return dailyChallenge ?? null;
};
