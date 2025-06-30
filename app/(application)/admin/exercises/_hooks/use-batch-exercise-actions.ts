import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useInvalidateExerciseList } from "./use-invalidate-exercise-list";

export function useBatchExerciseActions() {
    const t = useTranslations("admin.exercises");
    const trpc = useTRPC();
    const invalidateList = useInvalidateExerciseList();

    // Batch publish exercises
    const { mutateAsync: publishMultipleExercises } = useMutation(
        trpc.exercise.batchUpdateExerciseStatus.mutationOptions({
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

    // Batch draft exercises
    const { mutateAsync: draftMultipleExercises } = useMutation(
        trpc.exercise.batchUpdateExerciseStatus.mutationOptions({
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

    // Batch archive exercises
    const { mutateAsync: archiveMultipleExercises } = useMutation(
        trpc.exercise.batchUpdateExerciseStatus.mutationOptions({
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

    // Batch delete exercises
    const { mutateAsync: deleteMultipleExercises } = useMutation(
        trpc.exercise.batchDeleteExercises.mutationOptions({
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
        publishMultipleExercises: (ids: string[]) =>
            publishMultipleExercises({ ids, status: "published" }),
        draftMultipleExercises: (ids: string[]) =>
            draftMultipleExercises({ ids, status: "draft" }),
        archiveMultipleExercises: (ids: string[]) =>
            archiveMultipleExercises({ ids, status: "archived" }),
        deleteMultipleExercises: (ids: string[]) =>
            deleteMultipleExercises({ ids }),
    };
}
