import { format } from "date-fns";
import { and, eq } from "drizzle-orm";

import { exercise } from "@/db/schema/exercises";

import { InputQueryContext, getChallengeInput } from "./types";
import { isSolved } from "../utils/is-solved";
/**
 * Gets the daily challenge for today
 */
export const getChallenge = async ({
    db,
    input,
    session,
}: InputQueryContext<getChallengeInput>) => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");

    // If the id is "daily", we get the daily challenge
    // Otherwise, we get the challenge by id
    const idCondition =
        input.id === "daily"
            ? eq(exercise.dailyChallengeDate, formattedDate)
            : eq(exercise.id, input.id);

    const challenge = await db.query.exercise.findFirst({
        where: and(idCondition, eq(exercise.status, "published")),
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

    if (!challenge) return null;

    const { response, ...challengeData } = challenge;
    const functionSignature = response.split("\n")[0].trim();

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

    const defaultCode = `${functionSignature}\n\treturn ${randomReturnStatement};\n}`;

    const solved = await isSolved(session.user.id, challenge.id);

    return {
        ...challengeData,
        defaultCode: defaultCode,
        isSolved: solved,
    };
};
