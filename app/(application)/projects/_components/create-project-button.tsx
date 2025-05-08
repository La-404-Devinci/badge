"use client";

import * as React from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { RiAddLine } from "@remixicon/react";
import { RiCheckboxCircleFill } from "@remixicon/react";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";

import { NewProjectForm } from "./new-project-form";

export function CreateProjectButton({ className }: { className?: string }) {
    const t = useTranslations("components.application.createProject");
    const [open, setOpen] = React.useState(false);

    return (
        <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Trigger asChild>
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    onClick={() => setOpen(true)}
                    className={`w-full ${className}`}
                >
                    <Button.Icon as={RiAddLine} />
                    {t("label")}
                </Button.Root>
            </Modal.Trigger>

            <Modal.Content className="max-w-[840px]">
                <VisuallyHidden>
                    <Modal.Title>Create Project</Modal.Title>
                </VisuallyHidden>
                <Modal.Body className="flex flex-col justify-start items-start gap-4">
                    <div className="flex items-start gap-4">
                        <div className="rounded-10 bg-success-lighter flex size-10 shrink-0 items-center justify-center">
                            <RiCheckboxCircleFill className="text-success-base size-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-label-md text-text-strong-950">
                                Create Project
                            </div>
                            <div className="text-paragraph-sm text-text-sub-600">
                                Create a new project to get started.
                            </div>
                        </div>
                    </div>
                    <NewProjectForm />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Close asChild>
                        <Button.Root
                            variant="neutral"
                            mode="stroke"
                            size="small"
                            className="w-full"
                        >
                            Cancel
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root size="small" className="w-full">
                        View Receipt
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
