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

    if (cachedStreak !== null) {
        return parseInt(cachedStreak, 10);
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

    // Cache the streak for the rest of the day
    const diffInSeconds = differenceInSeconds(endOfToday(), new Date());

    await redis.set(
        REDIS_KEYS.USER_STREAK(userId),
        streak.toString(),
        diffInSeconds
    );

    return streak;
};
