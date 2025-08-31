"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import { RiEditLine, RiDeleteBinLine } from "@remixicon/react";

import { BadgeType } from "@/db/schema/badges";

export type BadgeData = BadgeType;

export function getBadgesColumns(
  t: ReturnType<typeof useTranslations<"admin.badges">>,
  onEdit: (badge: BadgeData) => void,
  onDelete: (badge: BadgeData) => void
): ColumnDef<BadgeData>[] {
  return [
    {
      accessorKey: "name",
      header: t("table.columns.name"),
      cell: ({ row }) => (
        <span className="font-medium text-text-base">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "displayName",
      header: t("table.columns.displayName"),
      cell: ({ row }) => (
        <span className="text-text-base">
          {row.original.displayName}
        </span>
      ),
    },
    {
      accessorKey: "image",
      header: t("table.columns.image"),
      cell: ({ row }) => (
        <div className="flex size-8 items-center justify-center">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt={`Image de ${row.original.name}`}
              className="size-8 rounded object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded bg-bg-weak-50">
              <span className="text-label-xs text-text-sub-600">-</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("table.columns.description"),
      cell: ({ row }) => (
        <span className="max-w-xs truncate text-text-sub-600">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "color",
      header: t("table.columns.color"),
      cell: ({ row }) => (
        <Badge.Root
          variant="light"
          color={row.original.color as any}
          className="capitalize"
        >
          {row.original.color}
        </Badge.Root>
      ),
    },
    {
      accessorKey: "maxLevel",
      header: t("table.columns.maxLevel"),
      cell: ({ row }) => (
        <span className="text-text-base">
          {row.original.maxLevel}
        </span>
      ),
    },
    {
      accessorKey: "baseExp",
      header: t("table.columns.baseExp"),
      cell: ({ row }) => (
        <span className="text-text-base">
          {row.original.baseExp}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t("table.columns.createdAt"),
      cell: ({ row }) => (
        <span className="text-text-sub-600">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("table.columns.actions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="xsmall"
            onClick={() => onEdit(row.original)}
          >
            <Button.Icon as={RiEditLine} />
            {t("table.actions.edit")}
          </Button.Root>
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="xsmall"
            onClick={() => onDelete(row.original)}
          >
            <Button.Icon as={RiDeleteBinLine} />
            {t("table.actions.delete")}
          </Button.Root>
        </div>
      ),
    },
  ];
}
