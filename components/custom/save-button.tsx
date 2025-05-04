"use client";

import { RiCheckLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Button from "@/components/ui/button";

interface SaveButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isDirty: boolean;
    isPending: boolean;
}

export function SaveButton({
    isDirty,
    isPending,
    onClick,
    ...props
}: SaveButtonProps) {
    const t = useTranslations();

    return (
        <Button.Root
            type="button"
            disabled={!isDirty || isPending}
            onClick={onClick}
            {...props}
        >
            {isPending ? (
                <>
                    <StaggeredFadeLoader
                        variant="muted"
                        className="flex size-5 shrink-0 items-center justify-center"
                    />
                    {t("common.saving")}
                </>
            ) : !isDirty ? (
                <>
                    <Button.Icon as={RiCheckLine} className="size-5" />
                    {t("common.saved")}
                </>
            ) : (
                t("common.apply")
            )}
        </Button.Root>
    );
}
