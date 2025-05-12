import { Suspense } from "react";

import { SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient } from "@/trpc/server";

import { ExercisesTable } from "./_components/exercises-table";
import { Filters } from "./_components/filters";
import { adminExercisesSearchParamsCache } from "./searchParams";

interface ExercisesPageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ExercisesPage({
    searchParams,
}: ExercisesPageProps) {
    await adminExercisesSearchParamsCache.parse(searchParams);

    return (
        <HydrateClient>
            <Suspense fallback={<CursorLoader />}>
                <div className="flex w-full flex-1 flex-col gap-4">
                    <Filters />
                    <ExercisesTable />
                </div>
            </Suspense>
        </HydrateClient>
    );
}
