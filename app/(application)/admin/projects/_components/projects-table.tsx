"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

import { CursorLoader } from "@/components/ui/cursor-loader";
import { useTRPC } from "@/trpc/client";
import { adminProjectsParsers } from "../searchParams";

import { ProjectsTableContent } from "./projects-table-content";
import { ProjectsTablePagination } from "./projects-table-pagination";

export function ProjectsTable() {
  const t = useTranslations("admin.exercises.projects");
  const trpc = useTRPC();

  // Get search params
  const [search] = useQueryState("search", adminProjectsParsers.search);
  const [status] = useQueryState("status", adminProjectsParsers.status);
  const [type] = useQueryState("type", adminProjectsParsers.type);
  const [page, setPage] = useQueryState("page", adminProjectsParsers.page);
  const [limit, setLimit] = useQueryState("limit", adminProjectsParsers.limit);

  // Query projects
  const { data, isLoading, error } = useQuery({
    ...trpc.project.listAdminProjects.queryOptions({
      search: search === "" ? undefined : search,
      status: status === "all" ? undefined : status,
      type: type === "all" ? undefined : type,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <CursorLoader className="size-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text-sub-600">{t("table.error")}</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text-sub-600">{t("table.noProjects")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ProjectsTableContent projects={data.data} />
      <ProjectsTablePagination
        total={data.total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
} 