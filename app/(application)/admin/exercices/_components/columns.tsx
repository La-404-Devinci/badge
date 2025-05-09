"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import * as Badge from "@/components/ui/badge";
import * as Checkbox from "@/components/ui/checkbox";
import { formatRelativeDate } from "@/lib/utils/dates/format-relative-date";
import { formatRelativeDays } from "@/lib/utils/dates/format-relative-days";
import { getSortingIcon } from "@/lib/utils/table/get-sorting-icon";
import { RouterOutput } from "@/trpc/client";

import { ExerciceActions } from "./actions";

// Define the exercice interface from our schema
export type Exercice =
    RouterOutput["exercice"]["listAdminExercices"]["exercices"][number];

export function getExercicesColumns(
    t: ReturnType<typeof useTranslations<"admin.exercices">>,
    tTime: ReturnType<typeof useTranslations<"common.time">>
): ColumnDef<Exercice, unknown>[] {
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
            id: "title",
            accessorKey: "title",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.title")}
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
                const exercice = row.original;
                if (!exercice) return null;

                return (
                    <div className="flex flex-col">
                        <div className="font-medium text-text-strong-950">
                            {exercice.title}
                        </div>
                        <div className="text-paragraph-xs text-text-soft-400">
                            {exercice.description}
                        </div>
                    </div>
                );
            },
            meta: {
                className: "w-full",
            },
        },
        {
            id: "difficulty",
            accessorKey: "difficulty",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.difficulty")}
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
                const exercice = row.original;
                if (!exercice) return null;

                const difficulty = exercice.difficulty;
                const color =
                    difficulty === "easy"
                        ? "green"
                        : difficulty === "medium"
                          ? "yellow"
                          : difficulty === "hard"
                            ? "red"
                            : "blue";

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root variant="lighter" color={color}>
                            {difficulty ? difficulty : t("filters.unknown")}
                        </Badge.Root>
                    </div>
                );
            },
        },
        {
            id: "status",
            accessorKey: "status",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.status")}
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
                const exercice = row.original;
                if (!exercice) return null;

                const status = exercice.status;
                const color =
                    status === "published"
                        ? "green"
                        : status === "draft"
                          ? "yellow"
                          : "gray";

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root color={color} variant="light" size="medium">
                            {status}
                        </Badge.Root>
                    </div>
                );
            },
        },
        {
            id: "systemCreated",
            accessorKey: "systemCreated",
            header: () => (
                <div className="flex items-center gap-0.5">
                    {t("columns.source")}
                </div>
            ),
            cell: ({ row }) => {
                const exercice = row.original;
                if (!exercice) return null;

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root
                            color={exercice.systemCreated ? "blue" : "green"}
                            variant="light"
                            size="medium"
                        >
                            {exercice.systemCreated
                                ? t("source.system")
                                : t("source.user")}
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
                    {t("columns.createdAt")}
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
                const exercice = row.original;
                if (!exercice) return null;

                return (
                    <div className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
                        {formatRelativeDate(exercice.createdAt)}
                    </div>
                );
            },
        },
        {
            id: "dailyChallengeDate",
            accessorKey: "dailyChallengeDate",
            header: ({ column }) => (
                <div className="flex items-center gap-0.5">
                    {t("columns.dailyChallengeDate")}
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
                const exercice = row.original;
                if (!exercice) return null;

                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
                            {exercice.dailyChallengeDate ?? "-"}
                        </div>

                        <div className="text-paragraph-xs text-text-soft-400">
                            {exercice.dailyChallengeDate
                                ? formatRelativeDays(
                                      new Date(exercice.dailyChallengeDate),
                                      tTime
                                  )
                                : "-"}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const exercice = row.original;

                return <ExerciceActions exercice={exercice} />;
            },
        },
    ];
}
