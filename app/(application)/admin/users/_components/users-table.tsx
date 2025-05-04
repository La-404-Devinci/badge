"use client";

import * as React from "react";

import { RiUserForbidFill } from "@remixicon/react";
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

import { useBatchUserActions } from "../_hooks/use-batch-user-actions";
import { adminUsersParsers, SortableColumn } from "../searchParams";
import { getUsersColumns, User } from "./columns";

export function UsersTable() {
    const t = useTranslations("adminUsers");

    // State for ban confirmation dialog
    const [showBanDialog, setShowBanDialog] = React.useState(false);
    const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

    // Get query params for filters
    const [search] = useQueryState("search", adminUsersParsers.search);
    const [role] = useQueryState("role", adminUsersParsers.role);
    const [waitlistStatus] = useQueryState(
        "waitlistStatus",
        adminUsersParsers.waitlistStatus
    );
    const [sortBy, setSortBy] = useQueryState(
        "sortBy",
        adminUsersParsers.sortBy
    );
    const [sortOrder, setSortOrder] = useQueryState(
        "sortOrder",
        adminUsersParsers.sortOrder
    );

    // Pagination
    const [page, setPage] = useQueryState("page", adminUsersParsers.page);
    const [limit, setLimit] = useQueryState("limit", adminUsersParsers.limit);

    // tRPC
    const trpc = useTRPC();
    const { banMultipleUsers } = useBatchUserActions();

    // Use tRPC to fetch users with filters
    const { data, isLoading } = useQuery(
        trpc.auth.listUsers.queryOptions(
            {
                page: page,
                limit: limit,
                sortBy: sortBy as SortableColumn,
                sortOrder: sortOrder,
                search: search,
                role: role,
                waitlistStatus: waitlistStatus,
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

    const columns = React.useMemo(() => getUsersColumns(t), [t]);

    const tableData = React.useMemo(() => {
        return isLoading ? [] : (data?.users ?? []);
    }, [data?.users, isLoading]);

    const table = useReactTable<User>({
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

    const handleBan = React.useCallback(() => {
        const selectedUsers = table
            .getSelectedRowModel()
            .rows.map((row) => row.original) as User[];

        if (selectedUsers.length === 0) return;

        setSelectedUserIds(selectedUsers.map((user) => user.id));
        setShowBanDialog(true);
    }, [table]);

    const handleConfirmBan = React.useCallback(() => {
        if (selectedUserIds.length === 0) return;

        banMultipleUsers(selectedUserIds);
        table.resetRowSelection();
        setShowBanDialog(false);
    }, [banMultipleUsers, selectedUserIds, table]);

    const { shortcutComponents } = useIslandShortcuts(
        [
            {
                key: "b",
                label: "Ban",
                action: handleBan,
                displayKey: "B",
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
                                className="h-72 text-center group-hover/row:bg-transparent"
                            >
                                <TableEmptyState
                                    title={t("emptyState.title")}
                                    description={t("emptyState.description")}
                                />
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>

            {data?.pagination && (
                <TablePagination
                    pagination={data.pagination}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                    itemName={t("pagination.users")}
                />
            )}

            {/* Selection Island */}
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

            {/* Ban Confirmation Dialog */}
            <ConfirmationDialog
                open={showBanDialog}
                onOpenChange={setShowBanDialog}
                title={t("banDialog.title")}
                description={
                    selectedUserIds.length === 1
                        ? t("banDialog.description", {
                              email:
                                  table
                                      .getRowModel()
                                      .rows.find(
                                          (row) =>
                                              (row.original as User).id ===
                                              selectedUserIds[0]
                                      )?.original.email || "",
                          })
                        : t("bulkBanDialog.description", {
                              count: selectedUserIds.length,
                          })
                }
                confirmText={t("banDialog.confirm")}
                cancelText={t("banDialog.cancel")}
                onConfirm={handleConfirmBan}
                variant="danger"
                icon={RiUserForbidFill}
            />
        </>
    );
}
