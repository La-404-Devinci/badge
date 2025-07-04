import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import DailyChallenge from "./_components/daily-challenge";
import DashboardHeader from "./_components/header";

export default function DashboardPage() {
    prefetch(trpc.exercise.getChallenge.queryOptions({ id: "daily" }));

    return (
        <HydrateClient>
            <Suspense fallback={<Skeleton />}>
                <DashboardHeader />

                <div className="flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(344px,1fr))] items-start justify-center gap-6">
                        <DailyChallenge />
                    </div>
                </div>
            </Suspense>
        </HydrateClient>
    );
}
