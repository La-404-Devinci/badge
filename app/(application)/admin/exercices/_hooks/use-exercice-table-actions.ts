import { useCallback, useState } from "react";

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

    // Publish exercice
    const { mutateAsync: updateExercice } = useMutation(
        trpc.exercice.updateExerciceStatus.mutationOptions({
            onMutate: (variables) => {
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: true,
                }));
            },
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(t("actions.publishSuccess"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
            onError: (error, variables) => {
                console.error(error);
                toast.error(t("actions.publishError"));
                setIsActionLoading((prev) => ({
                    ...prev,
                    [variables.id]: false,
                }));
            },
        })
    );

    const publishExercice = useCallback(
        (id: string) => updateExercice({ id, status: "published" }),
        [updateExercice]
    );

    const draftExercice = useCallback(
        (id: string) => updateExercice({ id, status: "draft" }),
        [updateExercice]
    );

    const archiveExercice = useCallback(
        (id: string) => updateExercice({ id, status: "archived" }),
        [updateExercice]
    );

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
            onMutate: () => {
                setIsActionLoading((prev) => ({ ...prev, generate: true }));
            },
            onSuccess: () => {
                invalidateList();
                toast.success(t("actions.generateSuccess"));
                setIsActionLoading((prev) => ({ ...prev, generate: false }));
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.generateError"));
                setIsActionLoading((prev) => ({ ...prev, generate: false }));
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
