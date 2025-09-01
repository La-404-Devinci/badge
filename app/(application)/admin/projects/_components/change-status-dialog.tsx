"use client";

import { useState } from "react";

import { RiSettings3Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";
import * as Select from "@/components/ui/select";
import { useTRPC } from "@/trpc/client";
import type { Project } from "@/db/schema";

interface ChangeStatusDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeStatusDialog({ project, open, onOpenChange }: ChangeStatusDialogProps) {
  const t = useTranslations("admin.exercises.projects.actions");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState(project.status);

  const { mutateAsync: changeProjectStatus, isPending } = useMutation({
    ...trpc.project.changeProjectStatus.mutationOptions(),
  });

  const handleChangeStatus = async () => {
    try {
      await changeProjectStatus({
        projectId: project.id,
        status: selectedStatus,
      });

      // Invalidate and refetch projects list
      queryClient.invalidateQueries();

      toast.success(t("changeStatusSuccess"));
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error changing project status:", error);
      if (error?.data?.code === "FORBIDDEN") {
        toast.error(t("completedProjectError"));
      } else {
        toast.error(t("changeStatusError"));
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return t("statuses.active");
      case "review":
        return t("statuses.review");
      case "inactive":
        return t("statuses.inactive");
      case "completed":
        return t("statuses.completed");
      case "cancelled":
        return t("statuses.cancelled");
      default:
        return status;
    }
  };

  const statusOptions = [
    { value: "review", label: getStatusLabel("review") },
    { value: "active", label: getStatusLabel("active") },
    { value: "inactive", label: getStatusLabel("inactive") },
    { value: "completed", label: getStatusLabel("completed") },
    { value: "cancelled", label: getStatusLabel("cancelled") },
  ];

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="max-w-[440px]">
        <Modal.Header>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-information-lighter">
              <RiSettings3Line className="size-6 text-information-base" />
            </div>
            <div>
              <Modal.Title>{t("changeStatusDialog.title")}</Modal.Title>
              <Modal.Description>
                {t("changeStatusDialog.description", { title: project.title })}
              </Modal.Description>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="mt-4">
            <label className="text-sm font-medium text-text-900">
              {t("changeStatusDialog.statusLabel")}
            </label>
            <Select.Root
              value={selectedStatus}
              onValueChange={(value: string) => setSelectedStatus(value as typeof selectedStatus)}
            >
              <Select.Trigger className="mt-2">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {statusOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="small"
              className="w-full"
              disabled={isPending}
            >
              {t("changeStatusDialog.cancel")}
            </Button.Root>
          </Modal.Close>
          <Button.Root
            variant="primary"
            size="small"
            className="w-full"
            onClick={handleChangeStatus}
            disabled={isPending}
          >
            {isPending ? t("loading") : t("changeStatusDialog.confirm")}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
