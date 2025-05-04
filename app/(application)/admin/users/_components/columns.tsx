"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import * as Avatar from "@/components/ui/avatar";
import * as Badge from "@/components/ui/badge";
import * as Checkbox from "@/components/ui/checkbox";
import { IconVerifiedFill } from "@/components/ui/icons";
import { formatRelativeDate } from "@/lib/utils/dates/format-relative-date";
import { getSortingIcon } from "@/lib/utils/table/get-sorting-icon";
import { RouterOutput } from "@/trpc/client";

import { UserActions } from "./actions";

// Define the user interface from our schema
export type User = RouterOutput["auth"]["listUsers"]["users"][number];

export function getUsersColumns(
    t: ReturnType<typeof useTranslations<"adminUsers">>
): ColumnDef<User, unknown>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox.Root
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox.Root
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "user",
            accessorKey: "name",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.user")}
                    <button
                        type="button"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {getSortingIcon(column.getIsSorted())}
                    </button>
                </div>
            ),
            enableSorting: true,
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                return (
                    <div className="flex items-center gap-3">
                        <Avatar.Root size="32">
                            {user.image ? (
                                <Avatar.Image
                                    src={user.image}
                                    alt={user.name}
                                />
                            ) : undefined}
                        </Avatar.Root>
                        <div>
                            <div className="font-medium text-text-strong-950">
                                {user.name}
                            </div>
                            <div className="text-paragraph-xs text-text-soft-400">
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
            meta: {
                className: "w-full",
            },
        },
        {
            id: "role",
            accessorKey: "role",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.role")}
                    <button
                        type="button"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {getSortingIcon(column.getIsSorted())}
                    </button>
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                const role = user.role;
                const color = role === "admin" ? "red" : "blue";

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root variant="lighter" color={color}>
                            {role ? role : t("filters.user")}
                        </Badge.Root>
                    </div>
                );
            },
        },
        {
            id: "emailVerified",
            accessorKey: "emailVerified",
            header: () => (
                <div className="flex items-center gap-0.5">
                    {t("columns.emailVerified")}
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                const verified = user.emailVerified;
                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root color="blue" variant="light" size="medium">
                            <Badge.Icon as={IconVerifiedFill} />
                            {verified
                                ? t("verification.yes")
                                : t("verification.no")}
                        </Badge.Root>
                    </div>
                );
            },
            meta: {
                className: "w-full",
            },
        },
        {
            id: "banned",
            accessorKey: "banned",
            header: () => (
                <div className="flex items-center gap-0.5">
                    {t("columns.banned")}
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root
                            color={user.banned ? "red" : "green"}
                            variant="light"
                            size="medium"
                        >
                            {user.banned ? t("banned.yes") : t("banned.no")}
                        </Badge.Root>
                    </div>
                );
            },
        },
        {
            id: "createdAt",
            accessorKey: "createdAt",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.joined")}
                    <button
                        type="button"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {getSortingIcon(column.getIsSorted())}
                    </button>
                </div>
            ),
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                return (
                    <div className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
                        {formatRelativeDate(user.createdAt)}
                    </div>
                );
            },
            meta: {
                className: "w-full",
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                if (!user) return null;

                return <UserActions user={user} />;
            },
            meta: {
                className: "w-10",
            },
        },
    ];
}
