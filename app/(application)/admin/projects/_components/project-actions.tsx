"use client";

import { useState } from "react";

import {
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMore2Line,
  RiSettings3Line,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import * as Button from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown";
import { useTRPC } from "@/trpc/client";
import type { Project } from "@/db/schema";
import { ChangeStatusDialog } from "./change-status-dialog";

export interface ProjectActionsProps {
  project: Project;
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const t = useTranslations("admin.exercises.projects.actions");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // State for confirmation dialogs
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);

  // Mutations
  const { mutateAsync: acceptProject } = useMutation({
    ...trpc.project.acceptProject.mutationOptions(),
  });

  const { mutateAsync: rejectProject } = useMutation({
    ...trpc.project.rejectProject.mutationOptions(),
  });

  const { mutateAsync: deleteProject } = useMutation({
    ...trpc.project.deleteProject.mutationOptions(),
  });

  // Handle accept project
  const handleAcceptProject = async () => {
    try {
      await acceptProject({ projectId: project.id });

      // Invalidate and refetch projects list
      queryClient.invalidateQueries();

      toast.success(t("acceptSuccess"));
      setShowAcceptDialog(false);
    } catch (error: any) {
      console.error("Error accepting project:", error);
      if (error?.data?.code === "FORBIDDEN") {
        toast.error(t("completedProjectError"));
      } else {
        toast.error(t("acceptError"));
      }
    }
  };

  // Handle reject project
  const handleRejectProject = async () => {
    try {
      await rejectProject({ projectId: project.id });

      // Invalidate and refetch projects list
      queryClient.invalidateQueries();

      toast.success(t("rejectSuccess"));
      setShowRejectDialog(false);
    } catch (error: any) {
      console.error("Error rejecting project:", error);
      if (error?.data?.code === "FORBIDDEN") {
        toast.error(t("completedProjectError"));
      } else {
        toast.error(t("rejectError"));
      }
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      await deleteProject({ projectId: project.id });

      // Invalidate and refetch projects list
      queryClient.invalidateQueries();

      toast.success(t("deleteSuccess"));
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error("Error deleting project:", error);
      if (error?.data?.code === "FORBIDDEN") {
        toast.error(t("completedProjectDeleteError"));
      } else {
        toast.error(t("deleteError"));
      }
    }
  };

  // Handle edit project
  const handleEditProject = () => {
    // TODO: Implement edit project logic
    console.log("Edit project:", project.id);
  };

  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="xsmall"
            className="ml-auto"
          >
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end" className="w-48">
          <Dropdown.Item
            onClick={handleEditProject}
            disabled={project.status === "completed"}
          >
            <Dropdown.ItemIcon as={RiEditLine} />
            {t("edit")}
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setShowChangeStatusDialog(true)}
            disabled={project.status === "completed"}
          >
            <Dropdown.ItemIcon as={RiSettings3Line} />
            {t("changeStatus")}
          </Dropdown.Item>

          {project.status === "review" && (
            <>
              <Dropdown.Item
                className="text-success-500"
                onClick={() => setShowAcceptDialog(true)}
              >
                <Dropdown.ItemIcon as={RiCheckLine} />
                {t("accept")}
              </Dropdown.Item>

              <Dropdown.Item
                className="text-error-500"
                onClick={() => setShowRejectDialog(true)}
              >
                <Dropdown.ItemIcon as={RiCloseLine} />
                {t("reject")}
              </Dropdown.Item>
            </>
          )}

          <Dropdown.Item
            className="text-error-500"
            onClick={() => setShowDeleteDialog(true)}
            disabled={project.status === "completed"}
          >
            <Dropdown.ItemIcon as={RiDeleteBinLine} />
            {t("delete")}
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>

      {/* Accept Confirmation Dialog */}
      <ConfirmationDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        title={t("acceptDialog.title")}
        description={t("acceptDialog.description", { title: project.title })}
        confirmText={t("acceptDialog.confirm")}
        cancelText={t("acceptDialog.cancel")}
        onConfirm={handleAcceptProject}
        variant="info"
        icon={RiCheckLine}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title={t("rejectDialog.title")}
        description={t("rejectDialog.description", { title: project.title })}
        confirmText={t("rejectDialog.confirm")}
        cancelText={t("rejectDialog.cancel")}
        onConfirm={handleRejectProject}
        variant="danger"
        icon={RiCloseLine}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t("deleteDialog.title")}
        description={t("deleteDialog.description", { title: project.title })}
        confirmText={t("deleteDialog.confirm")}
        cancelText={t("deleteDialog.cancel")}
        onConfirm={handleDeleteProject}
        variant="danger"
        icon={RiDeleteBinLine}
      />

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        project={project}
        open={showChangeStatusDialog}
        onOpenChange={setShowChangeStatusDialog}
      />
    </>
  );
} 