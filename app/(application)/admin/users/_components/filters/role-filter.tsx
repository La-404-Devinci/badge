"use client";

import { memo } from "react";

import { RiUserLine } from "@remixicon/react";
import isEqual from "fast-deep-equal";
import { useTranslations } from "next-intl";

import * as Select from "@/components/ui/select";

interface RoleFilterProps {
    value: string;
    onValueChange: (value: string) => void;
}

export const RoleFilter = memo(
    ({ value, onValueChange }: RoleFilterProps) => {
        const t = useTranslations("adminUsers.filters");

        return (
            <Select.Root value={value || ""} onValueChange={onValueChange}>
                <Select.Trigger className="w-40">
                    <Select.TriggerIcon as={RiUserLine} />
                    <Select.Value placeholder={t("role")} />
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="all">{t("all")}</Select.Item>
                    <Select.Item value="admin">{t("admin")}</Select.Item>
                    <Select.Item value="user">{t("user")}</Select.Item>
                </Select.Content>
            </Select.Root>
        );
    },
    (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

RoleFilter.displayName = "RoleFilter";
