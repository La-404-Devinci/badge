"use client";

import * as React from "react";

import {
    RiArchiveLine,
    RiDeleteBin5Line,
    RiDraftLine,
    RiMagicLine,
    RiMore2Line,
    RiShutDownLine,
} from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown";
import { ADMIN_PAGES } from "@/constants/pages";

import { Exercise } from "./columns";
import { useExerciseTableActions } from "../_hooks/use-exercise-table-actions";

interface ExerciseActionsProps {
    exercise: Exercise;
}

export function ExerciseActions({ exercise }: ExerciseActionsProps) {
    const t = useTranslations("admin.exercises");
    const router = useRouter();

    const {
        isActionLoading,
        publishExercise,
        draftExercise,
        archiveExercise,
        deleteExercise,
    } = useExerciseTableActions();

    const isLoading = isActionLoading[exercise?.id ?? ""];

    const handlePublish = React.useCallback(() => {
        if (!exercise) return;
        publishExercise(exercise.id);
    }, [exercise, publishExercise]);

    const handleDraft = React.useCallback(() => {
        if (!exercise) return;
        draftExercise(exercise.id);
    }, [exercise, draftExercise]);

    const handleArchive = React.useCallback(() => {
        if (!exercise) return;
        archiveExercise(exercise.id);
    }, [exercise, archiveExercise]);

    const handleDelete = React.useCallback(() => {
        if (!exercise) return;
        deleteExercise({ id: exercise.id });
    }, [exercise, deleteExercise]);

    const handleEdit = React.useCallback(() => {
        if (!exercise) return;
        router.push(`${ADMIN_PAGES.ADMIN_EXERCISES}/edit/${exercise.id}`);
    }, [exercise, router]);

    // Status-dependent actions
    const showPublishAction =
        exercise?.status === "draft" || exercise?.status === "archived";
    const showDraftAction =
        exercise?.status === "published" || exercise?.status === "archived";
    const showArchiveAction =
        exercise?.status === "published" || exercise?.status === "draft";

    return (
        <Dropdown.Root>
            <Dropdown.Trigger asChild>
                <Button.Root
                    variant="neutral"
                    mode="ghost"
                    size="xsmall"
                    className="ml-auto"
                    disabled={isLoading}
                >
                    <Button.Icon as={RiMore2Line} />
                </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end" className="w-48">
                <Dropdown.Item onClick={handleEdit}>
                    <Dropdown.ItemIcon as={RiMagicLine} />
                    <span>{t("actions.edit")}</span>
                </Dropdown.Item>

                {showPublishAction && (
                    <Dropdown.Item onClick={handlePublish}>
                        <Dropdown.ItemIcon as={RiShutDownLine} />
                        <span>{t("actions.publish")}</span>
                    </Dropdown.Item>
                )}

                {showDraftAction && (
                    <Dropdown.Item onClick={handleDraft}>
                        <Dropdown.ItemIcon as={RiDraftLine} />
                        <span>{t("actions.draft")}</span>
                    </Dropdown.Item>
                )}

                {showArchiveAction && (
                    <Dropdown.Item onClick={handleArchive}>
                        <Dropdown.ItemIcon as={RiArchiveLine} />
                        <span>{t("actions.archive")}</span>
                    </Dropdown.Item>
                )}

                <Dropdown.Item
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Dropdown.ItemIcon as={RiDeleteBin5Line} />
                    <span>{t("actions.delete")}</span>
                </Dropdown.Item>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}
