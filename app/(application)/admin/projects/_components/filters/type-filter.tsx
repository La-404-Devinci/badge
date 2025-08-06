"use client";

import { memo } from "react";

import { RiFilter3Line } from "@remixicon/react";
import isEqual from "fast-deep-equal";
import { useTranslations } from "next-intl";

import * as Select from "@/components/ui/select";

interface TypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TypeFilter = memo(
  ({ value, onValueChange }: TypeFilterProps) => {
    const t = useTranslations("admin.exercises.projects.filters");

    return (
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="w-40">
          <Select.TriggerIcon as={RiFilter3Line} />
          <Select.Value placeholder={t("type")} />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">{t("allTypes")}</Select.Item>
          <Select.Item value="uxui">{t("uxui")}</Select.Item>
          <Select.Item value="dev">{t("dev")}</Select.Item>
          <Select.Item value="marketing">{t("marketing")}</Select.Item>
          <Select.Item value="other">{t("other")}</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

TypeFilter.displayName = "TypeFilter"; 