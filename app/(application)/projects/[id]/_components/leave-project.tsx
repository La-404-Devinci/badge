"use client";

import { useState } from "react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { RiCloseCircleFill } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";
import { useTRPC } from "@/trpc/client";

export default function LeaveProject({ id }: { id: string }) {
    const trpc = useTRPC();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { mutateAsync: deleteContributor } = useMutation(
        trpc.project.deleteContributor.mutationOptions({
            onSuccess: () => {
                toast.success("Contributor deleted");
                router.push("/projects");
            },
            onError: () => {
                toast.error("Failed to delete contributor");
            },
        })
    );
    return (
        <Modal.Root open={open} onOpenChange={setOpen}>
            <Modal.Trigger asChild>
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    onClick={() => setOpen(true)}
                >
                    Quitter le projet
                </Button.Root>
            </Modal.Trigger>
            <Modal.Content className="max-w-[440px]">
                <VisuallyHidden asChild>
                    <Modal.Title>Quitter le projet</Modal.Title>
                </VisuallyHidden>
                <Modal.Body className="flex items-start gap-4">
                    <div className="rounded-10 bg-error-lighter flex size-10 shrink-0 items-center justify-center">
                        <RiCloseCircleFill className="text-error-base size-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-label-md text-text-strong-950">
                            Quitter le projet
                        </div>
                        <div className="text-paragraph-sm text-text-sub-600">
                            Vous quitterez le projet et ne pourrez plus y
                            contribuer.
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
                        >
                            Annuler
                        </Button.Root>
                    </Modal.Close>
                    <Button.Root
                        size="small"
                        className="w-full"
                        onClick={() => deleteContributor({ projectId: id })}
                    >
                        Quitter le projet
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
