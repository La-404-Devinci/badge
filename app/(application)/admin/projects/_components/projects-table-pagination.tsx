"use client";

import { useTranslations } from "next-intl";

import * as Select from "@/components/ui/select";

interface ProjectsTablePaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function ProjectsTablePagination({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: ProjectsTablePaginationProps) {
  const t = useTranslations("admin.exercises.projects.pagination");

  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-sub-600">
          {t("showing")} {startItem} {t("to")} {endItem} {t("of")} {total} {t("items")}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-sub-600">
            {t("itemsPerPage")}
          </span>
          <Select.Root
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(parseInt(value))}
          >
            <Select.Trigger className="w-20">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="10">10</Select.Item>
              <Select.Item value="25">25</Select.Item>
              <Select.Item value="50">50</Select.Item>
              <Select.Item value="100">100</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={page <= 1}
            className="flex items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-sm font-medium text-text-sub-600 hover:bg-bg-weak-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("previous")}
          </button>

          <span className="text-sm text-text-sub-600">
            {t("page")} {page} {t("of")} {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="flex items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 text-sm font-medium text-text-sub-600 hover:bg-bg-weak-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
} 