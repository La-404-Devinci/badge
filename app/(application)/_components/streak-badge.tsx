"use client";

import { RiFireFill } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export default function StreakBadge() {
    const trpc = useTRPC();

    const { data: streak } = useQuery(
        trpc.exercice.getUserStreak.queryOptions({})
    );

    return (
        <div className="flex items-center gap-0.5 rounded-full text-white bg-primary-base px-2 py-1">
            <p className="text-paragraph-xs font-bold">{streak ?? 0}</p>
            <RiFireFill className="size-4" />
        </div>
    );
}
