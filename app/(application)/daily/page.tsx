import { prefetch, trpc } from "@/trpc/server";

import DailyChallenge from "./_components/daily-challenge";

export default function DailyChallengePage() {
    prefetch(trpc.exercise.getChallenge.queryOptions({ id: "daily" }));

    return <DailyChallenge />;
}
