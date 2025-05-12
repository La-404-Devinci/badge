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

import { Exercice } from "./columns";
import { useExerciceTableActions } from "../_hooks/use-exercice-table-actions";

interface ExerciceActionsProps {
    exercice: Exercice;
}

export function ExerciceActions({ exercice }: ExerciceActionsProps) {
    const t = useTranslations("admin.exercices");
    const router = useRouter();

    const {
        isActionLoading,
        publishExercice,
        draftExercice,
        archiveExercice,
        deleteExercice,
    } = useExerciceTableActions();

    const isLoading = isActionLoading[exercice?.id ?? ""];

    const handlePublish = React.useCallback(() => {
        if (!exercice) return;
        publishExercice(exercice.id);
    }, [exercice, publishExercice]);

    const handleDraft = React.useCallback(() => {
        if (!exercice) return;
        draftExercice(exercice.id);
    }, [exercice, draftExercice]);

    const handleArchive = React.useCallback(() => {
        if (!exercice) return;
        archiveExercice(exercice.id);
    }, [exercice, archiveExercice]);

    const handleDelete = React.useCallback(() => {
        if (!exercice) return;
        deleteExercice({ id: exercice.id });
    }, [exercice, deleteExercice]);

    const handleEdit = React.useCallback(() => {
        if (!exercice) return;
        router.push(`${ADMIN_PAGES.ADMIN_EXERCICES}/edit/${exercice.id}`);
    }, [exercice, router]);

    // Status-dependent actions
    const showPublishAction =
        exercice?.status === "draft" || exercice?.status === "archived";
    const showDraftAction =
        exercice?.status === "published" || exercice?.status === "archived";
    const showArchiveAction =
        exercice?.status === "published" || exercice?.status === "draft";

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
