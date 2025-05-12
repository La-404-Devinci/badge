"use client";

import React, { useEffect, useState } from "react";

import { Editor } from "@monaco-editor/react";
import { RiArrowRightCircleLine, RiCloseLine } from "@remixicon/react";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Confetti from "react-confetti-boom";

import DifficultyBadge from "@/components/custom/difficulty-badge";
import ResponsiveDivider from "@/components/custom/responsive-divider";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Input from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    ExecuteCodeOutput,
    ValidationResult,
} from "@/server/routers/exercice/mutations/types";
import { useTRPC } from "@/trpc/client";

import EmptyState from "./empty-state";

export default function DailyChallenge() {
    const trpc = useTRPC();
    const t = useTranslations("daily");
    const queryClient = useQueryClient();

    const [exampleTests, setExampleTests] = useState<
        Record<number, ExecuteCodeOutput>
    >({});
    const [code, setCode] = useState("");

    const [submitResult, setSubmitResult] = useState<ValidationResult | null>(
        null
    );

    const { data: dailyChallenge } = useSuspenseQuery(
        trpc.exercice.getChallenge.queryOptions({ id: "daily" })
    );

    const { mutateAsync: executeCode } = useMutation(
        trpc.exercice.executeCode.mutationOptions()
    );

    const { mutateAsync: submitExercice } = useMutation(
        trpc.exercice.submitExercice.mutationOptions()
    );

    const handleRunExample = async (index: number) => {
        if (!dailyChallenge) return;

        const result = await executeCode({
            code: code,
            call: dailyChallenge.exampleInputs[index],
        });

        setExampleTests((prev) => ({
            ...prev,
            [index]: result,
        }));
    };

    const handleSubmitExercice = async () => {
        if (!dailyChallenge) return;

        const result = await submitExercice({
            code: code,
            exerciceId: dailyChallenge.id,
        });

        if (result.success) {
            // Invalidate user streak on success
            if (result.isStreak) {
                queryClient.invalidateQueries({
                    queryKey: trpc.exercice.getUserStreak.queryKey({}),
                });
            }

            // TODO: Show success dialog (with score and streak update)
        }

        setSubmitResult(result);
    };

    useEffect(() => {
        if (!dailyChallenge) return;
        setCode(dailyChallenge.defaultCode);
    }, [dailyChallenge]);

    if (!dailyChallenge) return <EmptyState />;

    return (
        <>
            {submitResult?.success === true && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <Confetti
                        x={0}
                        y={1}
                        particleCount={500}
                        spreadDeg={20}
                        launchSpeed={5}
                        deg={270 + 20}
                    />
                    <Confetti
                        x={1}
                        y={1}
                        particleCount={500}
                        spreadDeg={20}
                        launchSpeed={5}
                        deg={270 - 20}
                    />
                </div>
            )}
            <div className="grid flex-1 grid-cols-1 md:grid-cols-[1fr_4px_1fr] grid-rows-[auto_20px_auto] md:grid-rows-1">
                <div className="flex flex-col p-4 pb-2 md:pb-4">
                    <h1 className="text-title-h6 font-bold">
                        {dailyChallenge.title}
                    </h1>
                    <p className="text-paragraph-sm text-text-sub-600">
                        {dailyChallenge.description}
                    </p>

                    <div className="flex gap-2 mt-2">
                        {dailyChallenge.isSolved && (
                            <Badge.Root
                                variant="light"
                                color="green"
                                size="medium"
                            >
                                {t("solved")}
                            </Badge.Root>
                        )}

                        <DifficultyBadge
                            difficulty={dailyChallenge.difficulty ?? ""}
                            variant="filled"
                            size="medium"
                        />
                    </div>

                    <MarkdownRenderer className="my-4">
                        {dailyChallenge.problem}
                    </MarkdownRenderer>

                    <Divider.Root className="my-4 mx-4 w-[calc(100%-32px)]" />

                    <h2 className="text-title-h6 font-bold mb-4">
                        {t("examples")}
                    </h2>

                    <div className="flex flex-col gap-4">
                        {dailyChallenge.exampleInputs.map((example, index) => (
                            <React.Fragment key={example}>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button.Root
                                            variant="primary"
                                            mode="stroke"
                                            onClick={() =>
                                                handleRunExample(index)
                                            }
                                        >
                                            <Button.Icon
                                                as={RiArrowRightCircleLine}
                                            />
                                            {t("test")}
                                        </Button.Root>
                                        <Input.Root className="font-mono">
                                            <Input.Wrapper>
                                                <Input.Input
                                                    readOnly
                                                    value={example}
                                                />
                                            </Input.Wrapper>
                                        </Input.Root>
                                    </div>
                                    <p className="text-paragraph-sm text-text-sub-600 mt-2">
                                        {t("expected")}
                                        <code className="text-paragraph-sm text-text-sub-600 bg-bg-soft-200 rounded-md p-1 ms-2">
                                            {dailyChallenge.exampleOutputs?.[
                                                index
                                            ] ?? "'1'"}
                                        </code>
                                    </p>
                                    {exampleTests[index] && (
                                        <>
                                            <p className="text-paragraph-sm text-text-sub-600">
                                                {exampleTests[index].success
                                                    ? t("got")
                                                    : t("error")}
                                                <code
                                                    className={cn(
                                                        "text-paragraph-sm bg-bg-soft-200 rounded-md p-1 ms-2",
                                                        exampleTests[index]
                                                            ?.success
                                                            ? exampleTests[
                                                                  index
                                                              ]?.result ==
                                                              dailyChallenge
                                                                  .exampleOutputs?.[
                                                                  index
                                                              ]
                                                                ? "text-success-base"
                                                                : "text-warning-base"
                                                            : "text-error-base"
                                                    )}
                                                >
                                                    {exampleTests[index]
                                                        ?.success
                                                        ? exampleTests[index]
                                                              ?.result
                                                        : exampleTests[index]
                                                              ?.error}
                                                </code>
                                            </p>
                                            {exampleTests[index]?.logs && (
                                                <>
                                                    <p className="text-paragraph-sm text-text-sub-600">
                                                        {t("logs")}
                                                    </p>
                                                    <pre className="text-paragraph-xs text-text-sub-600 bg-bg-soft-200 rounded-md p-2">
                                                        {
                                                            exampleTests[index]
                                                                ?.logs
                                                        }
                                                    </pre>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                {index !==
                                    dailyChallenge.exampleInputs.length - 1 && (
                                    <Divider.Root className="my-2 mx-8 w-[calc(100%-64px)] opacity-50" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <ResponsiveDivider />
                <div className="flex flex-col">
                    <div className="flex flex-col flex-1">
                        <Editor
                            height="100%"
                            width="auto"
                            defaultLanguage="typescript"
                            value={code}
                            onChange={(value) => setCode(value ?? "")}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                            }}
                        />
                    </div>

                    <div className="border-t border-bg-soft-200 p-2 relative">
                        <Button.Root
                            variant="primary"
                            mode="stroke"
                            className="w-full"
                            onClick={handleSubmitExercice}
                        >
                            <Button.Icon as={RiArrowRightCircleLine} />
                            {t("submit")}
                        </Button.Root>

                        {submitResult?.success === false && (
                            <div className="absolute flex flex-col bottom-[calc(100%+1px)] left-0 right-0 bg-white border-t border-bg-soft-200 p-2 gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-paragraph-md font-bold text-text-sub-600">
                                        {t("submitError.title")}
                                    </p>
                                    <Button.Root
                                        variant="neutral"
                                        mode="ghost"
                                        onClick={() => setSubmitResult(null)}
                                    >
                                        <Button.Icon as={RiCloseLine} />
                                    </Button.Root>
                                </div>

                                <p className="text-paragraph-sm text-text-sub-600">
                                    {t("submitError.call")}
                                </p>
                                <code className="text-paragraph-sm text-text-sub-600 bg-bg-soft-200 rounded-md p-1 mb-2">
                                    {submitResult.call}
                                </code>

                                <p className="text-paragraph-sm text-text-sub-600">
                                    {t("submitError.expectedOutput")}
                                </p>
                                <code className="text-paragraph-sm text-text-sub-600 bg-bg-soft-200 rounded-md p-1 mb-2">
                                    {submitResult.expectedOutput}
                                </code>

                                <p className="text-paragraph-sm text-text-sub-600">
                                    {t("submitError.output")}
                                </p>
                                <code className="text-paragraph-sm text-text-sub-600 bg-bg-soft-200 rounded-md p-1 mb-2">
                                    {submitResult.output}
                                </code>

                                {submitResult.logs && (
                                    <>
                                        <p className="text-paragraph-sm text-text-sub-600">
                                            {t("submitError.logs")}
                                        </p>
                                        <pre className="text-paragraph-xs text-text-sub-600 bg-bg-soft-200 rounded-md p-2">
                                            {submitResult.logs}
                                        </pre>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
