import { Suspense } from "react";

import { type SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import AccountSettingsTabs from "./_components/account-settings-tabs";
import { searchParamsCache } from "./searchParams";

type PageAccountSettingsProps = {
    searchParams: Promise<SearchParams>;
};

export default async function PageAccountSettings({
    searchParams,
}: PageAccountSettingsProps) {
    // Parse search params
    await searchParamsCache.parse(searchParams);

    // Prefetch user session data for client components
    prefetch(trpc.user.getMe.queryOptions());

    // Prefetch user preferences for the language & region tab
    prefetch(trpc.user.getUserPreferences.queryOptions());

    return (
        <HydrateClient>
            <Suspense fallback={<CursorLoader />}>
                <AccountSettingsTabs />
            </Suspense>
        </HydrateClient>
    );
}
