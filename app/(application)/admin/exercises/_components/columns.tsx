"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import DifficultyBadge from "@/components/custom/difficulty-badge";
import * as Badge from "@/components/ui/badge";
import * as Checkbox from "@/components/ui/checkbox";
import { formatRelativeDate } from "@/lib/utils/dates/format-relative-date";
import { formatRelativeDays } from "@/lib/utils/dates/format-relative-days";
import { getSortingIcon } from "@/lib/utils/table/get-sorting-icon";
import { RouterOutput } from "@/trpc/client";

import { ExerciseActions } from "./actions";

// Define the exercise interface from our schema
export type Exercise =
    RouterOutput["exercise"]["listAdminExercises"]["exercises"][number];

export function getExercisesColumns(
    t: ReturnType<typeof useTranslations<"admin.exercises">>,
    tTime: ReturnType<typeof useTranslations<"common.time">>
): ColumnDef<Exercise, unknown>[] {
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
                const exercise = row.original;
                if (!exercise) return null;

                return (
                    <div className="flex flex-col">
                        <div className="font-medium text-text-strong-950">
                            {exercise.title}
                        </div>
                        <div className="text-paragraph-xs text-text-soft-400">
                            {exercise.description}
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
                const exercise = row.original;
                if (!exercise) return null;

                return (
                    <div className="flex items-center gap-3">
                        <DifficultyBadge
                            difficulty={exercise.difficulty ?? ""}
                            variant="lighter"
                        />
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
                const exercise = row.original;
                if (!exercise) return null;

                const status = exercise.status;
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
                const exercise = row.original;
                if (!exercise) return null;

                return (
                    <div className="flex items-center gap-3">
                        <Badge.Root
                            color={exercise.systemCreated ? "blue" : "green"}
                            variant="light"
                            size="medium"
                        >
                            {exercise.systemCreated
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
                const exercise = row.original;
                if (!exercise) return null;

                return (
                    <div className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
                        {formatRelativeDate(exercise.createdAt)}
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
                const exercise = row.original;
                if (!exercise) return null;

                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="whitespace-nowrap text-paragraph-sm text-text-sub-600">
                            {exercise.dailyChallengeDate ?? "-"}
                        </div>

                        <div className="text-paragraph-xs text-text-soft-400">
                            {exercise.dailyChallengeDate
                                ? formatRelativeDays(
                                      new Date(exercise.dailyChallengeDate),
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
                const exercise = row.original;

                return <ExerciseActions exercise={exercise} />;
            },
        },
    ];
}
