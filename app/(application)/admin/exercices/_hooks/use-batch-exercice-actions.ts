import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useInvalidateExerciceList } from "./use-invalidate-exercice-list";

export function useBatchExerciceActions() {
    const t = useTranslations("admin.exercices");
    const trpc = useTRPC();
    const invalidateList = useInvalidateExerciceList();

    // Batch publish exercices
    const { mutateAsync: publishMultipleExercices } = useMutation(
        trpc.exercice.batchUpdateExerciceStatus.mutationOptions({
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(
                    t("actions.batchPublishSuccess", {
                        count: variables.ids.length,
                    })
                );
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.batchPublishError"));
            },
        })
    );

    // Batch draft exercices
    const { mutateAsync: draftMultipleExercices } = useMutation(
        trpc.exercice.batchUpdateExerciceStatus.mutationOptions({
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(
                    t("actions.batchDraftSuccess", {
                        count: variables.ids.length,
                    })
                );
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.batchDraftError"));
            },
        })
    );

    // Batch archive exercices
    const { mutateAsync: archiveMultipleExercices } = useMutation(
        trpc.exercice.batchUpdateExerciceStatus.mutationOptions({
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(
                    t("actions.batchArchiveSuccess", {
                        count: variables.ids.length,
                    })
                );
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.batchArchiveError"));
            },
        })
    );

    // Batch delete exercices
    const { mutateAsync: deleteMultipleExercices } = useMutation(
        trpc.exercice.batchDeleteExercices.mutationOptions({
            onSuccess: (_, variables) => {
                invalidateList();
                toast.success(
                    t("actions.batchDeleteSuccess", {
                        count: variables.ids.length,
                    })
                );
            },
            onError: (error) => {
                console.error(error);
                toast.error(t("actions.batchDeleteError"));
            },
        })
    );

    return {
        publishMultipleExercices: (ids: string[]) =>
            publishMultipleExercices({ ids, status: "published" }),
        draftMultipleExercices: (ids: string[]) =>
            draftMultipleExercices({ ids, status: "draft" }),
        archiveMultipleExercices: (ids: string[]) =>
            archiveMultipleExercices({ ids, status: "archived" }),
        deleteMultipleExercices: (ids: string[]) =>
            deleteMultipleExercices({ ids }),
    };
}
