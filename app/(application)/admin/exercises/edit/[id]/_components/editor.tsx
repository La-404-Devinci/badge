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
import { Exercise } from "@/db/schema";
import { useTRPC } from "@/trpc/client";

import Executable from "./executable";

interface ExerciseEditorProps {
    exercise: Exercise;
}

export default function ExerciseEditor({ exercise }: ExerciseEditorProps) {
    const t = useTranslations("admin.exercises.editor");
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [isSaving, setIsSaving] = useState(false);
    const [draftExercise, setDraftExercise] = useState(exercise);

    const updateExercise = useCallback(
        (
            key: keyof Exercise,
            value: (typeof draftExercise)[keyof Exercise]
        ) => {
            setDraftExercise((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [setDraftExercise]
    );

    const handleAddValue = useCallback(
        (key: keyof Exercise) => {
            setDraftExercise((prev) => ({
                ...prev,
                [key]: [...(prev[key] as string[]), ""],
            }));
        },
        [setDraftExercise]
    );

    const handleRemoveValue = useCallback(
        (key: keyof Exercise, index: number) => {
            setDraftExercise((prev) => ({
                ...prev,
                [key]: (prev[key] as string[]).filter((_, i) => i !== index),
            }));
        },
        [setDraftExercise]
    );

    const handleUpdateValue = useCallback(
        (key: keyof Exercise, index: number, value: string) => {
            setDraftExercise((prev) => ({
                ...prev,
                [key]: (prev[key] as string[]).map((v, i) =>
                    i === index ? value : v
                ),
            }));
        },
        [setDraftExercise]
    );

    const { mutateAsync: updateExerciseMutation } = useMutation(
        trpc.exercise.updateExercise.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: trpc.exercise.listAdminExercises.queryKey(),
                });

                queryClient.invalidateQueries({
                    queryKey: trpc.exercise.getAdminExercise.queryKey({
                        id: exercise.id!,
                    }),
                });

                toast.success(t("success"));
            },
        })
    );

    const handleDiscard = useCallback(() => {
        setDraftExercise(exercise);
    }, [exercise, setDraftExercise]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);

        const payload = Object.fromEntries(
            Object.entries(draftExercise).filter(
                ([_, value]) => value !== null && value !== undefined
            )
        );

        await updateExerciseMutation({
            ...payload,
            id: exercise.id!,
        });

        setIsSaving(false);
    }, [draftExercise, exercise.id, updateExerciseMutation]);

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex gap-2 sticky top-2 p-2 border border-bg-soft-200 shadow-regular-sm rounded-xl items-center z-20 bg-white/80 backdrop-blur-sm">
                <Button.Root variant="neutral" mode="ghost" asChild>
                    <Link href={PAGES.ADMIN_EXERCISES}>
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
                            value={draftExercise.title}
                            onChange={(e) => {
                                updateExercise("title", e.target.value);
                            }}
                            placeholder={exercise.title}
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
                            value={draftExercise.description}
                            onChange={(e) => {
                                updateExercise("description", e.target.value);
                            }}
                            placeholder={exercise.description}
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
                        value={draftExercise.difficulty ?? undefined}
                        onValueChange={(value) => {
                            updateExercise("difficulty", value ?? "unknown");
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
                                value={draftExercise.dailyChallengeDate ?? ""}
                                onChange={(e) => {
                                    updateExercise(
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
                    value={draftExercise.problem}
                    onChange={(value) => {
                        updateExercise("problem", value);
                    }}
                    placeholder={exercise.problem}
                    id="problem"
                />
            </div>

            <div className="flex flex-col gap-0.5 mt-2">
                <Label.Root htmlFor="hints">{t("labels.hints")}</Label.Root>
                {draftExercise.hints.map((hint, index) => (
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
                            placeholder={exercise.hints[index]}
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
                        value={draftExercise.response}
                        onChange={(value) => {
                            updateExercise("response", value ?? "");
                        }}
                    />
                </div>
            </div>

            <Divider.Root className="my-2" variant="dotted-line" />

            <div className="flex flex-col gap-0.5">
                <Label.Root htmlFor="exampleInputs">
                    {t("labels.exampleInputs")}
                </Label.Root>

                {draftExercise.exampleInputs.map((exampleInput, index) => (
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
                            code={draftExercise.response}
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

                {draftExercise.validationInputs.map(
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
                                code={draftExercise.response}
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
