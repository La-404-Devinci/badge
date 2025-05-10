import console from "console";

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
            exampleOutputs: true,
            difficulty: true,
            response: true, // Use the solution to generate the example function
        },
    });

    if (!dailyChallenge) return null;

    const { response, ...daily } = dailyChallenge;

    const functionSignature = response.split("{")[0].trim();

    const returnStatements = [
        "'Owo'",
        "42",
        "'Hello world'",
        "404",
        "Infinity",
        "null",
        "'https://discord.gg/UueH8wMweY'",
        "'The answer to the universe'",
        "'Something'",
        "12; // Maybe this is the solution everytime",
        "undefined",
        "Math.PI",
        "7",
        "'dlrow olleH'",
    ];

    const randomReturnStatement =
        returnStatements[Math.floor(Math.random() * returnStatements.length)];

    const defaultCode = `${functionSignature} {\n\treturn ${randomReturnStatement};\n}`;

    return {
        ...daily,
        defaultCode,
    };
};
