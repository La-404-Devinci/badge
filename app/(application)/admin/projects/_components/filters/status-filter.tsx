"use client";

import { memo } from "react";

import { RiFilter3Line } from "@remixicon/react";
import isEqual from "fast-deep-equal";
import { useTranslations } from "next-intl";

import * as Select from "@/components/ui/select";

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const StatusFilter = memo(
  ({ value, onValueChange }: StatusFilterProps) => {
    const t = useTranslations("admin.exercises.projects.filters");

    return (
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="w-40">
          <Select.TriggerIcon as={RiFilter3Line} />
          <Select.Value placeholder={t("status")} />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">{t("allStatuses")}</Select.Item>
          <Select.Item value="review">{t("review")}</Select.Item>
          <Select.Item value="active">{t("active")}</Select.Item>
          <Select.Item value="inactive">{t("inactive")}</Select.Item>
          <Select.Item value="completed">{t("completed")}</Select.Item>
          <Select.Item value="cancelled">{t("cancelled")}</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

StatusFilter.displayName = "StatusFilter"; 