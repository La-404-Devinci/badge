import { Suspense } from "react";

import { SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient } from "@/trpc/server";

import { ExercicesTable } from "./_components/exercices-table";
import { Filters } from "./_components/filters";
import { adminExercicesSearchParamsCache } from "./searchParams";

interface ExercicesPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ExercicesPage({
    searchParams,
}: ExercicesPageProps) {
    await adminExercicesSearchParamsCache.parse(searchParams);

    return (
        <HydrateClient>
            <Suspense fallback={<CursorLoader />}>
                <div className="flex w-full flex-1 flex-col gap-4">
                    <Filters />
                    <ExercicesTable />
                </div>
            </Suspense>
        </HydrateClient>
    );
}
