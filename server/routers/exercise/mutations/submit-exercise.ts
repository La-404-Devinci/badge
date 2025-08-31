import { differenceInSeconds, endOfToday } from "date-fns";
import { eq, sql } from "drizzle-orm";

import { redis, REDIS_KEYS } from "@/db/redis";
import { submission } from "@/db/schema/submissions";
import { user } from "@/db/schema/auth-schema";
import { exercise } from "@/db/schema/exercises";
import { BadgeService } from "@/lib/badges/service";

import { InputMutationContext, SubmitExerciseInput } from "./types";
import { isSolved } from "../utils/is-solved";
import { validateSubmission } from "./validate-submission";
import type { Session } from "@/lib/auth/types";

export const submitExercise = async ({
    input,
    db: dbInstance,
    session,
}: InputMutationContext<SubmitExerciseInput> & {
    session: Session;
}) => {
    const { exerciseId, code } = input;

    // Get the exercise
    const exerciseToSubmit = await dbInstance.query.exercise.findFirst({
        where: eq(exercise.id, exerciseId),
    });

    if (!exerciseToSubmit) {
        throw new Error("Exercise not found");
    }

    // Check the response validity
    const result = await validateSubmission(
        dbInstance,
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
    await dbInstance
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
        await dbInstance
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

    // Attribuer de l'expérience au badge "daily" si c'est un défi quotidien
    if (exerciseToSubmit.dailyChallengeDate) {
        try {
            const badgeResult = await BadgeService.addExperience(
                session.user.id,
                "daily",
                100, // Expérience de base pour un défi quotidien
                "daily_challenge",
                exerciseId,
                `Défi quotidien réussi: ${exerciseToSubmit.title}`
            );

            // Si c'est un level up, on pourrait afficher une notification
            if (badgeResult.levelUp) {
                console.log(
                    `Level up! Badge daily: ${badgeResult.previousLevel} → ${badgeResult.newLevel}`
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de l'attribution d'expérience au badge:",
                error
            );
            // Ne pas faire échouer la soumission si le badge échoue
        }
    }

    return {
        success: true as const,
        isStreak: isStreak,
    };
};
