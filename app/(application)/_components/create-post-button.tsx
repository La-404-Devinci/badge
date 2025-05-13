"use client";

import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";

export function CreatePostButton({ className }: { className?: string }) {
    const t = useTranslations("components.application");

    return (
        <Button.Root className={className} variant="neutral">
            {t("createPost")}
        </Button.Root>
    );
}
