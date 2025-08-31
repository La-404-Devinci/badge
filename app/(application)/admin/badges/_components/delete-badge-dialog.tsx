"use client";

import { useTranslations } from "next-intl";
import { RiErrorWarningFill } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import { useTRPC } from "@/trpc/client";

import type { BadgeData } from "./columns";

interface DeleteBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
}

export function DeleteBadgeDialog({ open, onOpenChange, badge }: DeleteBadgeDialogProps) {
  const t = useTranslations("admin.badges");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBadge } = useMutation(
    trpc.badge.delete.mutationOptions({
      onSuccess: () => {
        // Invalider la liste des badges pour rafraîchir les données
        queryClient.invalidateQueries({
          queryKey: trpc.badge.listAdminBadges.queryKey(),
        });
      },
    })
  );

  const handleDelete = async () => {
    if (!badge) return;

    try {
      await deleteBadge({ id: badge.id });
      // Fermer automatiquement la modale en cas de succès
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting badge:", error);
      // En cas d'erreur, la modale reste ouverte pour que l'utilisateur puisse réessayer
    }
  };

  if (!badge) return null;

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("delete.title")}
      description={t("delete.description", { name: badge.displayName })}
      onConfirm={handleDelete}
      cancelText={t("delete.form.cancel")}
      confirmText={t("delete.form.delete")}
      variant="danger"
      icon={RiErrorWarningFill}
      showClose={false}
    />
  );
}
