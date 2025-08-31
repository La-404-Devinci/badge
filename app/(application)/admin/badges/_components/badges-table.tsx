"use client";

import * as React from "react";
import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { TableEmptyState } from "@/components/custom/table/empty-state";
import { TableLoadingSkeleton } from "@/components/custom/table/loading-skeleton";
import { TablePagination } from "@/components/custom/table/pagination";
import * as Table from "@/components/ui/table";
import {
  handleSortingChange,
  queryParamsToSortingState,
} from "@/lib/utils/table/sorting-state";
import { useTRPC } from "@/trpc/client";

import { adminBadgesParsers } from "../searchParams";
import { getBadgesColumns, BadgeData } from "./columns";
import { EditBadgeModal } from "./edit-badge-modal";
import { DeleteBadgeDialog } from "./delete-badge-dialog";

export function BadgesTable() {
  const t = useTranslations("admin.badges");

  // État pour les modaux
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null);
  const [deletingBadge, setDeletingBadge] = useState<BadgeData | null>(null);

  // Get query params for filters
  const [search] = useQueryState("search", adminBadgesParsers.search);
  const [type] = useQueryState("type", adminBadgesParsers.type);
  const [color] = useQueryState("color", adminBadgesParsers.color);
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    adminBadgesParsers.sortBy
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    adminBadgesParsers.sortOrder
  );

  // Pagination
  const [page, setPage] = useQueryState("page", adminBadgesParsers.page);
  const [limit, setLimit] = useQueryState("limit", adminBadgesParsers.limit);

  // tRPC
  const trpc = useTRPC();

  // Use tRPC to fetch badges with filters
  const { data, isLoading } = useQuery(
    trpc.badge.listAdminBadges.queryOptions(
      {
        page: page ?? 1,
        limit: limit ?? 20,
        sortBy: (sortBy as "name" | "displayName" | "maxLevel" | "createdAt" | undefined) ?? undefined,
        sortOrder: sortOrder ?? "desc",
        search: search ?? undefined,
        type: type ?? undefined,
        color: color ?? undefined,
      },
      {
        placeholderData: keepPreviousData,
      }
    )
  );

  const tableSorting = React.useMemo<SortingState>(
    () => queryParamsToSortingState(sortBy, sortOrder),
    [sortBy, sortOrder]
  );

  const columns = React.useMemo(() => getBadgesColumns(
    t,
    setEditingBadge,
    setDeletingBadge
  ), [t, setEditingBadge, setDeletingBadge]);

  const tableData = React.useMemo(() => {
    return isLoading ? [] : (data?.badges ?? []);
  }, [data?.badges, isLoading]);

  const table = useReactTable<BadgeData>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: tableSorting,
    },
    onSortingChange: (updater) => {
      handleSortingChange(updater, setSortBy, setSortOrder);
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: data?.totalPages ?? 0,
  });

  if (isLoading) {
    return (
      <div className="rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <Table.Root>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Head key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </Table.Head>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            <TableLoadingSkeleton columnLength={columns.length} />
          </Table.Body>
        </Table.Root>
      </div>
    );
  }

  if (!tableData.length) {
    return (
      <TableEmptyState
        title={t("table.empty.title")}
        description={t("table.empty.description")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="rounded-20 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="overflow-x-auto">
          <Table.Root>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Head key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </Table.Head>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      </div>

      {/* Pagination */}
      <TablePagination
        pagination={{
          total: data?.totalItems ?? 0,
          totalPages: data?.totalPages ?? 0,
          hasNextPage: (data?.currentPage ?? 0) < (data?.totalPages ?? 0),
          hasPreviousPage: (data?.currentPage ?? 0) > 1,
        }}
        page={page || 1}
        limit={limit || 20}
        onPageChange={setPage}
        onLimitChange={setLimit}
        itemName="badges"
      />

      {/* Modaux */}
      <EditBadgeModal
        open={!!editingBadge}
        onOpenChange={(open) => !open && setEditingBadge(null)}
        badge={editingBadge}
      />

      <DeleteBadgeDialog
        open={!!deletingBadge}
        onOpenChange={(open) => !open && setDeletingBadge(null)}
        badge={deletingBadge}
      />
    </div>
  );
}
