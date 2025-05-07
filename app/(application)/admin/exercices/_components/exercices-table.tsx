"use client";

import * as React from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type SortingState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import {
    Island,
    IslandBadge,
    IslandContent,
    IslandDivider,
    IslandKbdButton,
} from "@/components/custom/island";
import { IslandDeselect } from "@/components/custom/island/island-deselect";
import { TableEmptyState } from "@/components/custom/table/empty-state";
import { TableLoadingSkeleton } from "@/components/custom/table/loading-skeleton";
import { TablePagination } from "@/components/custom/table/pagination";
import * as Table from "@/components/ui/table";
import { useIslandShortcuts } from "@/hooks/use-island-shortcuts";
import {
    handleSortingChange,
    queryParamsToSortingState,
} from "@/lib/utils/table/sorting-state";
import { useTRPC } from "@/trpc/client";

import { useBatchExerciceActions } from "../_hooks/use-batch-exercice-actions";
import { adminExercicesParsers, SortableColumn } from "../searchParams";
import { getExercicesColumns, Exercice } from "./columns";

export function ExercicesTable() {
    const t = useTranslations("admin.exercices");

    // State for delete confirmation dialog
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [selectedExerciceIds, setSelectedExerciceIds] = React.useState<
        string[]
    >([]);

    // Get query params for filters
    const [search] = useQueryState("search", adminExercicesParsers.search);
    const [status] = useQueryState("status", adminExercicesParsers.status);
    const [difficulty] = useQueryState(
        "difficulty",
        adminExercicesParsers.difficulty
    );
    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        adminExercicesParsers.sortBy
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        adminExercicesParsers.sortOrder
    );

    // Pagination
    const [page, setPage] = useQueryState("page", adminExercicesParsers.page);
    const [limit, setLimit] = useQueryState(
        "limit",
        adminExercicesParsers.limit
    );

    // tRPC
    const trpc = useTRPC();
    const {
        deleteMultipleExercices,
        publishMultipleExercices,
        draftMultipleExercices,
        archiveMultipleExercices,
    } = useBatchExerciceActions();

    // Use tRPC to fetch exercices with filters
    const { data, isLoading } = useQuery(
        trpc.exercice.listExercices.queryOptions(
            {
                page: page,
                limit: limit,
                sortBy: sortBy as SortableColumn,
                sortOrder: sortOrder,
                search: search,
                status: status === "unarchived" ? undefined : status,
                difficulty: difficulty === "all" ? undefined : difficulty,
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

    const columns = React.useMemo(() => getExercicesColumns(t), [t]);

    const tableData = React.useMemo(() => {
        return isLoading ? [] : (data?.exercices ?? []);
    }, [data?.exercices, isLoading]);

    const table = useReactTable<Exercice>({
        data: tableData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        onSortingChange: (updaterOrValue) => {
            handleSortingChange<SortableColumn>({
                updaterOrValue,
                currentSorting: tableSorting,
                setSortBy,
                setSortOrder,
                setPage,
                currentPage: page,
            });
        },
        state: {
            sorting: tableSorting,
        },
    });

    // Batch action handlers
    const handleDelete = React.useCallback(() => {
        const selectedExercices = table
            .getSelectedRowModel()
            .rows.map((row) => row.original) as Exercice[];

        if (selectedExercices.length === 0) return;

        setSelectedExerciceIds(
            selectedExercices.map((exercice) => exercice.id)
        );
        setShowDeleteDialog(true);
    }, [table]);

    const handleConfirmDelete = React.useCallback(() => {
        if (selectedExerciceIds.length === 0) return;

        deleteMultipleExercices(selectedExerciceIds);
        table.resetRowSelection();
        setShowDeleteDialog(false);
    }, [deleteMultipleExercices, selectedExerciceIds, table]);

    const handlePublish = React.useCallback(() => {
        const selectedExercices = table
            .getSelectedRowModel()
            .rows.map((row) => row.original) as Exercice[];

        if (selectedExercices.length === 0) return;

        const ids = selectedExercices.map((exercice) => exercice.id);
        publishMultipleExercices(ids);
        table.resetRowSelection();
    }, [publishMultipleExercices, table]);

    const handleDraft = React.useCallback(() => {
        const selectedExercices = table
            .getSelectedRowModel()
            .rows.map((row) => row.original) as Exercice[];

        if (selectedExercices.length === 0) return;

        const ids = selectedExercices.map((exercice) => exercice.id);
        draftMultipleExercices(ids);
        table.resetRowSelection();
    }, [draftMultipleExercices, table]);

    const handleArchive = React.useCallback(() => {
        const selectedExercices = table
            .getSelectedRowModel()
            .rows.map((row) => row.original) as Exercice[];

        if (selectedExercices.length === 0) return;

        const ids = selectedExercices.map((exercice) => exercice.id);
        archiveMultipleExercices(ids);
        table.resetRowSelection();
    }, [archiveMultipleExercices, table]);

    const { shortcutComponents } = useIslandShortcuts(
        [
            {
                key: "d",
                label: t("actions.delete"),
                action: handleDelete,
                displayKey: "D",
            },
            {
                key: "p",
                label: t("actions.publish"),
                action: handlePublish,
                displayKey: "P",
            },
            {
                key: "r",
                label: t("actions.draft"),
                action: handleDraft,
                displayKey: "R",
            },
            {
                key: "a",
                label: t("actions.archive"),
                action: handleArchive,
                displayKey: "A",
            },
        ],
        {
            enabled: table.getSelectedRowModel().rows.length > 0,
            onEscapeKey: () => table.resetRowSelection(),
        }
    );

    return (
        <>
            <Table.Root className="-mx-4 w-auto px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]">
                <Table.Header className="whitespace-nowrap">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.Head key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </Table.Head>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        <TableLoadingSkeleton columnLength={columns.length} />
                    ) : table.getRowModel().rows?.length > 0 ? (
                        table.getRowModel().rows.map((row, i, arr) => (
                            <React.Fragment key={row.id}>
                                <Table.Row
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                                {i < arr.length - 1 && <Table.RowDivider />}
                            </React.Fragment>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                <TableEmptyState
                                    title={t("empty.title")}
                                    description={t("empty.description")}
                                />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>

            {/* Pagination */}
            {data?.pagination && (
                <TablePagination
                    pagination={data.pagination}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                    itemName={t("pagination.exercices")}
                />
            )}

            {/* Selection island */}
            <Island
                show={table.getSelectedRowModel().rows.length > 0}
                count={table.getSelectedRowModel().rows.length}
            >
                <IslandContent>
                    <IslandBadge />
                    {shortcutComponents.map((shortcutComponent) => (
                        <React.Fragment key={shortcutComponent.key}>
                            <IslandDivider />
                            <IslandKbdButton
                                label={shortcutComponent.label}
                                shortcut={shortcutComponent.shortcut}
                                onClick={shortcutComponent.onClick}
                            />
                        </React.Fragment>
                    ))}
                    <IslandDeselect
                        onDeselect={() => table.resetRowSelection()}
                    />
                </IslandContent>
            </Island>

            {/* Delete confirmation dialog */}
            <ConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title={t("confirmations.delete.title")}
                description={t("confirmations.delete.description", {
                    count: selectedExerciceIds.length,
                })}
                onConfirm={handleConfirmDelete}
                confirmText={t("confirmations.delete.confirm")}
                cancelText={t("confirmations.delete.cancel")}
            />
        </>
    );
}
