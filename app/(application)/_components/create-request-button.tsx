"use client";

import { RiAddLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";

export function CreateRequestButton({ className }: { className?: string }) {
    const t = useTranslations("components.application.createRequest");

    return (
        <Button.Root className={className}>
            <Button.Icon as={RiAddLine} />
            {t("label")}
        </Button.Root>
    );
}
