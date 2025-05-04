import { Suspense } from "react";

import { SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient } from "@/trpc/server";

import { Filters } from "./_components/filters";
import { UsersTable } from "./_components/users-table";
import { adminUsersSearchParamsCache } from "./searchParams";

interface UsersPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    await adminUsersSearchParamsCache.parse(searchParams);

    return (
        <HydrateClient>
            <Suspense fallback={<CursorLoader />}>
                <div className="flex w-full flex-1 flex-col gap-4">
                    <Filters />
                    <UsersTable />
                </div>
            </Suspense>
        </HydrateClient>
    );
}
