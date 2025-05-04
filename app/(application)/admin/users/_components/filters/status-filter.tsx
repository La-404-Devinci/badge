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
        const t = useTranslations("adminUsers.filters");

        return (
            <Select.Root value={value} onValueChange={onValueChange}>
                <Select.Trigger className="w-40">
                    <Select.TriggerIcon as={RiFilter3Line} />
                    <Select.Value placeholder={t("waitlistStatus")} />
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="all">{t("all")}</Select.Item>
                    <Select.Item value="approved">{t("approved")}</Select.Item>
                    <Select.Item value="pending">{t("pending")}</Select.Item>
                    <Select.Item value="rejected">{t("rejected")}</Select.Item>
                </Select.Content>
            </Select.Root>
        );
    },
    (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

StatusFilter.displayName = "StatusFilter";
