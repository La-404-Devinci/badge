import { Suspense } from "react";

import { SearchParams } from "nuqs/server";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { HydrateClient } from "@/trpc/server";

import { ProjectsTable } from "./_components/projects-table";
import { Filters } from "./_components/filters";
import { adminProjectsSearchParamsCache } from "./searchParams";

interface ProjectsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  await adminProjectsSearchParamsCache.parse(searchParams);

  return (
    <HydrateClient>
      <Suspense fallback={<CursorLoader />}>
        <div className="flex w-full flex-1 flex-col gap-4">
          <Filters />
          <ProjectsTable />
        </div>
      </Suspense>
    </HydrateClient>
  );
} 