import { Suspense } from "react";

import { type SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";

import PrivacySecurityTabs from "./_components/privacy-security-tabs";
import { searchParamsCache } from "./searchParams";

type PagePrivacySecurityProps = {
    searchParams: Promise<SearchParams>;
};

export default async function PagePrivacySecurity({
    searchParams,
}: PagePrivacySecurityProps) {
    // Parse search params
    await searchParamsCache.parse(searchParams);

    return (
        <Suspense fallback={<CursorLoader />}>
            <PrivacySecurityTabs />
        </Suspense>
    );
}
