"use client";

import * as React from "react";

import * as DialogPrimitives from "@radix-ui/react-dialog";
import {
    RiAlertFill,
    RiErrorWarningFill,
    type RemixiconComponentType,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";

import { StaggeredFadeLoader } from "../staggered-fade-loader";

export type ConfirmationDialogProps = {
    title: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
    cancelText?: string;
    confirmText?: string;
    isLoading?: boolean;
    variant?: "danger" | "warning" | "info";
    icon?: RemixiconComponentType;
    showClose?: boolean;
};

export function ConfirmationDialog({
    title,
    description,
    open,
    onOpenChange,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    isLoading = false,
    variant = "danger",
    icon,
    showClose = false,
}: ConfirmationDialogProps) {
    let IconComponent: RemixiconComponentType = icon || RiErrorWarningFill;
    let iconContainerClass = "bg-error-lighter";
    let iconClass = "text-error-base";
    let buttonVariant: "error" | "primary" | "neutral" = "error";

    const t = useTranslations("common");

    if (variant === "warning") {
        IconComponent = icon || RiAlertFill;
        iconContainerClass = "bg-warning-lighter";
        iconClass = "text-warning-base";
        buttonVariant = "primary";
    } else if (variant === "info") {
        IconComponent = icon || RiAlertFill;
        iconContainerClass = "bg-information-lighter";
        iconClass = "text-information-base";
        buttonVariant = "primary";
    }

    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Modal.Root open={open} onOpenChange={onOpenChange}>
            <Modal.Content showClose={showClose} className="max-w-[440px]">
                <Modal.Body>
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconContainerClass}`}
                        >
                            <IconComponent className={`size-6 ${iconClass}`} />
                        </div>

                        <div>
                            <DialogPrimitives.Title className="text-label-md text-text-strong-950">
                                {title}
                            </DialogPrimitives.Title>
                            <DialogPrimitives.Description className="mt-1 text-paragraph-sm text-text-sub-600">
                                {description}
                            </DialogPrimitives.Description>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            variant="neutral"
                            mode="stroke"
                            size="small"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        variant={buttonVariant}
                        size="small"
                        className="w-full"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <StaggeredFadeLoader variant="muted" />}
                        {isLoading ? t("loading") : confirmText}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
