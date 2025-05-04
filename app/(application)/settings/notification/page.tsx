import { Suspense } from "react";

import { type SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import NotificationSettingsTabs from "./_components/notification-settings-tabs";
import { searchParamsCache } from "./searchParams";

type PageNotificationSettingsProps = {
    searchParams: Promise<SearchParams>;
};

export default async function PageNotificationSettings({
    searchParams,
}: PageNotificationSettingsProps) {
    // Parse search params
    await searchParamsCache.parse(searchParams);

    // Prefetch notification settings data
    prefetch(trpc.notification.getUserNotificationSettings.queryOptions());

    return (
        <HydrateClient>
            <Suspense fallback={<CursorLoader />}>
                <NotificationSettingsTabs />
            </Suspense>
        </HydrateClient>
    );
}
