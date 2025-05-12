"use client";

import { RiFireFill } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

export default function StreakBadge() {
    const trpc = useTRPC();

    const { data: streakData } = useQuery(
        trpc.exercice.getUserStreak.queryOptions({})
    );

    return (
        <div
            className={cn(
                "flex items-center gap-0.5 rounded-full text-white px-2 py-1",
                streakData?.hasTodayStreak
                    ? "bg-primary-base"
                    : "bg-neutral-300"
            )}
        >
            <p className="text-paragraph-xs font-bold">
                {streakData?.streak ?? 0}
            </p>
            <RiFireFill className="size-4" />
        </div>
    );
}
