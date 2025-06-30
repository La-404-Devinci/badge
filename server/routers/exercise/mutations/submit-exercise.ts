import { differenceInSeconds, endOfToday } from "date-fns";
import { eq, sql } from "drizzle-orm";

import { Database } from "@/db";
import { redis, REDIS_KEYS } from "@/db/redis";
import { user } from "@/db/schema/auth-schema";
import { exercise } from "@/db/schema/exercises";
import { submission } from "@/db/schema/submissions";
import { Session } from "@/lib/auth/types";

import { executeCode } from "./execute-code";
import { InputMutationContext, SubmitExerciseInput } from "./types";
import { ValidationResult } from "./types";
import { isSolved } from "../utils/is-solved";

const validateSubmission = async (
    db: Database,
    code: string,
    calls: string[],
    expectedOutputs: string[]
): Promise<ValidationResult> => {
    for (let index = 0; index < calls.length; index++) {
        const call = calls[index];
        const expectedOutput = expectedOutputs[index];

        const result = await executeCode({
            db,
            input: {
                code: code,
                call: call,
            },
        });

        if (!result.success)
            return {
                success: false,
                call: call,
                output: result.error,
                expectedOutput: expectedOutput,
                logs: result.logs,
            };

        if (result.result != expectedOutput) {
            return {
                success: false,
                call: call,
                output: result.result,
                expectedOutput: expectedOutput,
                logs: result.logs,
            };
        }
    }

    return { success: true };
};

export const submitExercise = async ({
    input,
    db,
    session,
}: InputMutationContext<SubmitExerciseInput> & {
    session: Session;
}) => {
    const { exerciseId, code } = input;

    // Get the exercise
    const exerciseToSubmit = await db.query.exercise.findFirst({
        where: eq(exercise.id, exerciseId),
    });

    if (!exerciseToSubmit) {
        throw new Error("Exercise not found");
    }

    // Check the response validity
    const result = await validateSubmission(
        db,
        code,
        exerciseToSubmit.validationInputs,
        exerciseToSubmit.validationOutputs as string[]
    );

    // Check if user already solved this exercise correctly
    const solved = await isSolved(session.user.id, exerciseId);
    const isStreak =
        !(await redis.get(REDIS_KEYS.HAS_STREAK_TODAY(session.user.id))) &&
        result.success;

    // Create a new submission
    await db
        .insert(submission)
        .values({
            userId: session.user.id,
            exerciseId: exerciseId,
            submittedCode: code,
            isCorrect: result.success,
            isStreak: isStreak,
        })
        .returning();

    if (!result.success) return result;

    // Score
    if (!solved) {
        await db
            .update(user)
            .set({
                score: sql`${user.score} + ${exerciseToSubmit.score}`,
            })
            .where(eq(user.id, session.user.id));
    }

    // Streak
    if (isStreak) {
        const ttl = differenceInSeconds(endOfToday(), new Date());

        await redis.set(
            REDIS_KEYS.HAS_STREAK_TODAY(session.user.id),
            "true",
            ttl
        );

        // Increment current steak if cached
        const cachedStatus = await redis.get(
            REDIS_KEYS.USER_STREAK(session.user.id)
        );

        if (cachedStatus) {
            await redis.set(
                REDIS_KEYS.USER_STREAK(session.user.id),
                (parseInt(cachedStatus) + 1).toString(),
                ttl
            );
        }
    }

    return {
        success: true as const,
        isStreak: isStreak,
    };
};
