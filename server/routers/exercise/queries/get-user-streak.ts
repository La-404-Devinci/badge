import {
    differenceInDays,
    differenceInSeconds,
    endOfToday,
    startOfDay,
} from "date-fns";
import { eq, and, desc } from "drizzle-orm";

import { redis, REDIS_KEYS } from "@/db/redis";
import { submission } from "@/db/schema/submissions";

import { getUserStreakInput, InputQueryContext } from "./types";

const calculateStreak = (submissions: { createdAt: Date }[]) => {
    const dates = [new Date(), ...submissions.map((s) => s.createdAt)];
    let streak = 0;

    for (let i = 1; i < dates.length; i++) {
        const diffInDays = differenceInDays(
            startOfDay(dates[i - 1]),
            startOfDay(dates[i])
        );

        if (diffInDays <= 1) streak++;
        else break;
    }

    return streak;
};

export const getUserStreak = async ({
    db,
    session,
    input,
}: InputQueryContext<getUserStreakInput>) => {
    const userId = input.userId ?? session.user.id;

    // Get the cached streak if it exists
    const cachedStreak = await redis.get(REDIS_KEYS.USER_STREAK(userId));
    const cachedHasTodayStreak = await redis.get(
        REDIS_KEYS.HAS_STREAK_TODAY(userId)
    );

    if (cachedStreak !== null) {
        return {
            streak: parseInt(cachedStreak, 10),
            hasTodayStreak: cachedHasTodayStreak === "true",
        };
    }

    // Recalculate the streak from submission history
    const submissions = await db.query.submission.findMany({
        where: and(
            eq(submission.userId, userId),
            eq(submission.isStreak, true)
        ),
        orderBy: desc(submission.createdAt),
        columns: {
            createdAt: true,
        },
    });

    const streak = calculateStreak(submissions);
const streak = calculateStreak(submissions);
const hasTodayStreak =
    streak > 0 &&
    submissions.length > 0 &&
    differenceInDays(
        startOfDay(submissions[0].createdAt),
        startOfDay(new Date())
    ) === 0;

    // Cache the streak for the rest of the day
    const diffInSeconds = differenceInSeconds(endOfToday(), new Date());

    await redis.set(
        REDIS_KEYS.USER_STREAK(userId),
        streak.toString(),
        diffInSeconds
    );

    return { streak, hasTodayStreak };
};
