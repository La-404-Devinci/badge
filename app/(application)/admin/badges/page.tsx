import { Suspense } from "react";

import { SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient } from "@/trpc/server";

import { BadgeActions } from "./_components/actions";
import { Filters } from "./_components/filters";
import { BadgesTable } from "./_components/badges-table";
import { adminBadgesSearchParamsCache } from "./searchParams";

interface BadgesPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BadgesPage({ searchParams }: BadgesPageProps) {
  await adminBadgesSearchParamsCache.parse(searchParams);

  return (
    <HydrateClient>
      <Suspense fallback={<CursorLoader />}>
        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-heading-lg font-semibold text-text-base">
              Gérer les badges
            </h1>
            <BadgeActions />
          </div>
          <Filters />
          <BadgesTable />
        </div>
      </Suspense>
    </HydrateClient>
  );
}
