import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useInvalidateExerciseList } from "./use-invalidate-exercise-list";

export function useExerciseTableActions() {
    const t = useTranslations("admin.exercises");
    const trpc = useTRPC();
    const invalidateList = useInvalidateExerciseList();

    const [isActionLoading, setIsActionLoading] = useState<
        Record<string, boolean>
    >({});

    // Update exercise status
    const { mutateAsync: updateExerciseStatus } = useMutation(
        trpc.exercise.updateExerciseStatus.mutationOptions({
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

    // Publish exercise
    const publishExercise = async (id: string) => {
        await updateExerciseStatus({ id, status: "published" });
    };

    // Draft exercise
    const draftExercise = (id: string) =>
        updateExerciseStatus({ id, status: "draft" });

    // Archive exercise
    const archiveExercise = (id: string) =>
        updateExerciseStatus({ id, status: "archived" });

    // Delete exercise
    const { mutateAsync: deleteExercise } = useMutation(
        trpc.exercise.deleteExercise.mutationOptions({
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

    // Generate exercise using trigger.dev
    const { mutateAsync: generateExercise } = useMutation(
        trpc.exercise.generateExercise.mutationOptions({
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
        publishExercise,
        draftExercise,
        archiveExercise,
        deleteExercise,
        generateExercise,
    };
}
