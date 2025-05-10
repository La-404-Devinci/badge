import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useInvalidateExerciceList } from "./use-invalidate-exercice-list";

export function useExerciceTableActions() {
    const t = useTranslations("admin.exercices");
    const trpc = useTRPC();
    const invalidateList = useInvalidateExerciceList();

    const [isActionLoading, setIsActionLoading] = useState<
        Record<string, boolean>
    >({});

    // Update exercice status
    const { mutateAsync: updateExerciceStatus } = useMutation(
        trpc.exercice.updateExerciceStatus.mutationOptions({
            onMutate: (variables) => {
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: true,
                }));
            },
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(t("actions.updateSuccess"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
            onError: (error, variables) => {
                console.error(error);
                toast.error(t("actions.updateError"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
        })
    );

    // Publish exercice
    const publishExercice = async (id: string) => {
        await updateExerciceStatus({ id, status: "published" });
    };

    // Draft exercice
    const draftExercice = (id: string) =>
        updateExerciceStatus({ id, status: "draft" });

    // Archive exercice
    const archiveExercice = (id: string) =>
        updateExerciceStatus({ id, status: "archived" });

    // Delete exercice
    const { mutateAsync: deleteExercice } = useMutation(
        trpc.exercice.deleteExercice.mutationOptions({
            onMutate: (variables) => {
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: true,
                }));
            },
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(t("actions.deleteSuccess"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
            onError: (error, variables) => {
                console.error(error);
                toast.error(t("actions.deleteError"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
        })
    );

    // Generate exercice using trigger.dev
    const { mutateAsync: generateExercice } = useMutation(
        trpc.exercice.generateExercice.mutationOptions({
            onSuccess: () => {
                invalidateList();
                toast.success(t("actions.generateSuccess"));
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.generateError"));
            },
        })
    );

    return {
        isActionLoading,
        publishExercice,
        draftExercice,
        archiveExercice,
        deleteExercice,
        generateExercice,
    };
}
