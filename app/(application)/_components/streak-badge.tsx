"use client";

import { RiFireFill } from "@remixicon/react";

import { authClient } from "@/lib/auth/client";

export default function StreakBadge() {
    const { data: session } = authClient.useSession();

    return (
        <div className="flex items-center gap-0.5 rounded-full text-white bg-primary-base px-2 py-1">
            <p className="text-paragraph-xs font-bold">
                {session?.user?.streak ?? 0}
            </p>
            <RiFireFill className="size-4" />
        </div>
    );
}
