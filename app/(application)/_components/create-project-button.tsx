"use client";

import { RiAddLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";

export function CreateProjectButton({ className }: { className?: string }) {
    const t = useTranslations("components.application");

    return (
        <Button.Root className={className}>
            <Button.Icon as={RiAddLine} />
            {t("createProject")}
        </Button.Root>
    );
}
