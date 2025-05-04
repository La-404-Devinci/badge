"use client";

import { memo } from "react";

import { RiFilterOffLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";

interface ClearFiltersButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export const ClearFiltersButton = memo(
    ({ onClick, disabled }: ClearFiltersButtonProps) => {
        const t = useTranslations("components.table");

        if (disabled) {
            return null;
        }

        return (
            <Button.Root
                variant="neutral"
                mode="ghost"
                onClick={onClick}
                disabled={disabled}
            >
                <Button.Icon as={RiFilterOffLine} />
                {t("clearFilters")}
            </Button.Root>
        );
    },
    (prevProps, nextProps) =>
        prevProps.disabled === nextProps.disabled &&
        prevProps.onClick === nextProps.onClick
);

ClearFiltersButton.displayName = "ClearFiltersButton";
