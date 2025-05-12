"use client";

import { useCallback, useState } from "react";

import Editor from "@monaco-editor/react";
import {
    RiAddLine,
    RiArrowLeftLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiSaveLine,
} from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import MarkdownEditor from "@/components/custom/markdown-editor";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import { PAGES } from "@/constants/pages";
import { Exercice } from "@/db/schema";
import { useTRPC } from "@/trpc/client";

import Executable from "./executable";

interface ExerciceEditorProps {
    exercice: Exercice;
}

export default function ExerciceEditor({ exercice }: ExerciceEditorProps) {
    const t = useTranslations("admin.exercices.editor");
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [isSaving, setIsSaving] = useState(false);
    const [draftExercice, setDraftExercice] = useState(exercice);

    const updateExercice = useCallback(
        (
            key: keyof Exercice,
            value: (typeof draftExercice)[keyof Exercice]
        ) => {
            setDraftExercice((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [setDraftExercice]
    );

    const handleAddValue = useCallback(
        (key: keyof Exercice) => {
            setDraftExercice((prev) => ({
                ...prev,
                [key]: [...(prev[key] as string[]), ""],
            }));
        },
        [setDraftExercice]
    );

    const handleRemoveValue = useCallback(
        (key: keyof Exercice, index: number) => {
            setDraftExercice((prev) => ({
                ...prev,
                [key]: (prev[key] as string[]).filter((_, i) => i !== index),
            }));
        },
        [setDraftExercice]
    );

    const handleUpdateValue = useCallback(
        (key: keyof Exercice, index: number, value: string) => {
            setDraftExercice((prev) => ({
                ...prev,
                [key]: (prev[key] as string[]).map((v, i) =>
                    i === index ? value : v
                ),
            }));
        },
        [setDraftExercice]
    );

    const { mutateAsync: updateExerciceMutation } = useMutation(
        trpc.exercice.updateExercice.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: trpc.exercice.listAdminExercices.queryKey(),
                });

                queryClient.invalidateQueries({
                    queryKey: trpc.exercice.getAdminExercice.queryKey({
                        id: exercice.id!,
                    }),
                });

                toast.success(t("success"));
            },
        })
    );

    const handleDiscard = useCallback(() => {
        setDraftExercice(exercice);
    }, [exercice, setDraftExercice]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);

        const payload = Object.fromEntries(
            Object.entries(draftExercice).filter(
                ([_, value]) => value !== null && value !== undefined
            )
        );

        await updateExerciceMutation({
            ...payload,
            id: exercice.id!,
        });

        setIsSaving(false);
    }, [draftExercice, exercice.id, updateExerciceMutation]);

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 sticky top-2 p-2 border border-bg-soft-200 shadow-regular-sm rounded-xl items-center z-20 bg-white/80 backdrop-blur-sm">
                <Button.Root variant="neutral" mode="ghost" asChild>
                    <Link href={PAGES.ADMIN_EXERCICES}>
                        <Button.Icon as={RiArrowLeftLine} />
                    </Link>
                </Button.Root>

                <h2 className="text-paragraph-lg font-bold me-auto">
                    {t("title")}
                </h2>

                <Button.Root
                    variant="primary"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <StaggeredFadeLoader />
                            {t("buttons.saving")}
                        </>
                    ) : (
                        <>
                            <Button.Icon as={RiSaveLine} />
                            {t("buttons.save")}
                        </>
                    )}
                </Button.Root>

                <Button.Root
                    variant="neutral"
                    mode="lighter"
                    onClick={handleDiscard}
                >
                    <Button.Icon as={RiCloseLine} />
                    {t("buttons.discard")}
                </Button.Root>
            </div>

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="title">{t("labels.title")}</Label.Root>
                <Input.Root>
                    <Input.Wrapper>
                        <Input.Input
                            id="title"
                            value={draftExercice.title}
                            onChange={(e) => {
                                updateExercice("title", e.target.value);
                            }}
                            placeholder={exercice.title}
                        />
                    </Input.Wrapper>
                </Input.Root>
            </div>

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="description">
                    {t("labels.description")}
                </Label.Root>
                <Input.Root>
                    <Input.Wrapper>
                        <Input.Input
                            id="description"
                            value={draftExercice.description}
                            onChange={(e) => {
                                updateExercice("description", e.target.value);
                            }}
                            placeholder={exercice.description}
                        />
                    </Input.Wrapper>
                </Input.Root>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex md:flex-row flex-col gap-2">
                <div className="flex flex-col gap-0.5 flex-1">
                    <Label.Root htmlFor="difficulty">
                        {t("labels.difficulty")}
                    </Label.Root>
                    <Select.Root
                        value={draftExercice.difficulty ?? undefined}
                        onValueChange={(value) => {
                            updateExercice("difficulty", value ?? "unknown");
                        }}
                    >
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="easy">
                                {t("difficulty.easy")}
                            </Select.Item>
                            <Select.Item value="medium">
                                {t("difficulty.medium")}
                            </Select.Item>
                            <Select.Item value="hard">
                                {t("difficulty.hard")}
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </div>

                <div className="flex flex-col gap-0.5 flex-1">
                    <Label.Root htmlFor="dailyChallengeDate">
                        {t("labels.dailyChallengeDate")}
                    </Label.Root>
                    <Input.Root>
                        <Input.Wrapper>
                            <Input.Input
                                id="dailyChallengeDate"
                                value={draftExercice.dailyChallengeDate ?? ""}
                                onChange={(e) => {
                                    updateExercice(
                                        "dailyChallengeDate",
                                        e.target.value
                                    );
                                }}
                            />
                        </Input.Wrapper>
                    </Input.Root>
                </div>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="problem">{t("labels.problem")}</Label.Root>
                <MarkdownEditor
                    value={draftExercice.problem}
                    onChange={(value) => {
                        updateExercice("problem", value);
                    }}
                    placeholder={exercice.problem}
                    id="problem"
                />
            </div>

            <div className="flex flex-col gap-0.5 mt-2">
                <Label.Root htmlFor="hints">{t("labels.hints")}</Label.Root>
                {draftExercice.hints.map((hint, index) => (
                    <div key={index} className="flex flex-col gap-0.5 mb-2">
                        <div className="flex flex-row gap-2 mb-1 mt-2">
                            <Label.Root htmlFor={`hint-${index}`}>
                                {t("labels.hint", { index: index + 1 })}
                            </Label.Root>
                            <Button.Root
                                className="ms-auto"
                                variant="error"
                                mode="lighter"
                                size="xsmall"
                                onClick={() =>
                                    handleRemoveValue("hints", index)
                                }
                            >
                                <Button.Icon as={RiDeleteBinLine} />
                            </Button.Root>
                        </div>
                        <MarkdownEditor
                            key={index}
                            value={hint}
                            id={`hint-${index}`}
                            onChange={(value) => {
                                handleUpdateValue("hints", index, value);
                            }}
                            placeholder={exercice.hints[index]}
                            rows={2}
                        />
                    </div>
                ))}
                <Button.Root
                    variant="neutral"
                    mode="lighter"
                    className="mt-2"
                    onClick={() => handleAddValue("hints")}
                >
                    <Button.Icon as={RiAddLine} />
                    {t("buttons.addHint")}
                </Button.Root>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="response">
                    {t("labels.response")}
                </Label.Root>
                <div className="border rounded-md border-bg-soft-200 shadow-regular-sm">
                    <Editor
                        height="300px"
                        defaultLanguage="typescript"
                        value={draftExercice.response}
                        onChange={(value) => {
                            updateExercice("response", value ?? "");
                        }}
                    />
                </div>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="exampleInputs">
                    {t("labels.exampleInputs")}
                </Label.Root>

                {draftExercice.exampleInputs.map((exampleInput, index) => (
                    <div className="flex flex-col gap-0.5" key={index}>
                        <div className="flex flex-row gap-2 mb-1 mt-2">
                            <Label.Root htmlFor={`exampleInput-${index}`}>
                                {t("labels.exampleInput", { index: index + 1 })}
                            </Label.Root>

                            <Button.Root
                                className="ms-auto"
                                variant="error"
                                mode="lighter"
                                size="xsmall"
                                onClick={() =>
                                    handleRemoveValue("exampleInputs", index)
                                }
                            >
                                <Button.Icon as={RiDeleteBinLine} />
                            </Button.Root>
                        </div>

                        <Input.Root>
                            <Input.Wrapper>
                                <Input.Input
                                    id={`exampleInput-${index}`}
                                    value={exampleInput}
                                    onChange={(e) => {
                                        handleUpdateValue(
                                            "exampleInputs",
                                            index,
                                            e.target.value
                                        );
                                    }}
                                />
                            </Input.Wrapper>
                        </Input.Root>

                        <Executable
                            code={draftExercice.response}
                            call={exampleInput}
                        />
                    </div>
                ))}
                <Button.Root
                    variant="neutral"
                    mode="lighter"
                    className="mt-2"
                    onClick={() => handleAddValue("exampleInputs")}
                >
                    <Button.Icon as={RiAddLine} />
                    {t("buttons.addExampleInput")}
                </Button.Root>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="validationInputs">
                    {t("labels.validationInputs")}
                </Label.Root>

                {draftExercice.validationInputs.map(
                    (validationInput, index) => (
                        <div className="flex flex-col gap-0.5" key={index}>
                            <div className="flex flex-row gap-2 mb-1 mt-2">
                                <Label.Root
                                    htmlFor={`validationInput-${index}`}
                                >
                                    {t("labels.validationInput", {
                                        index: index + 1,
                                    })}
                                </Label.Root>

                                <Button.Root
                                    className="ms-auto"
                                    variant="error"
                                    mode="lighter"
                                    size="xsmall"
                                    onClick={() =>
                                        handleRemoveValue(
                                            "validationInputs",
                                            index
                                        )
                                    }
                                >
                                    <Button.Icon as={RiDeleteBinLine} />
                                </Button.Root>
                            </div>

                            <Input.Root>
                                <Input.Wrapper>
                                    <Input.Input
                                        id={`validationInput-${index}`}
                                        value={validationInput}
                                        onChange={(e) => {
                                            handleUpdateValue(
                                                "validationInputs",
                                                index,
                                                e.target.value
                                            );
                                        }}
                                    />
                                </Input.Wrapper>
                            </Input.Root>

                            <Executable
                                code={draftExercice.response}
                                call={validationInput}
                            />
                        </div>
                    )
                )}

                <Button.Root
                    variant="neutral"
                    mode="lighter"
                    className="mt-2"
                    onClick={() => handleAddValue("validationInputs")}
                >
                    <Button.Icon as={RiAddLine} />
                    {t("buttons.addValidationInput")}
                </Button.Root>
            </div>
        </div>
    );
}
