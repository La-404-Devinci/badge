"use client";

import React, { useEffect, useState } from "react";

import { Editor } from "@monaco-editor/react";
import { RiArrowRightCircleLine } from "@remixicon/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import DifficultyBadge from "@/components/custom/difficulty-badge";
import ResponsiveDivider from "@/components/custom/responsive-divider";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import * as Input from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExecuteCodeOutput } from "@/server/routers/exercice/mutations";
import { useTRPC } from "@/trpc/client";

import EmptyState from "./empty-state";

export default function DailyChallenge() {
    const trpc = useTRPC();
    const t = useTranslations("daily");

    const [exampleTests, setExampleTests] = useState<
        Record<number, ExecuteCodeOutput>
    >({});
    const [code, setCode] = useState("");

    const { data: dailyChallenge } = useSuspenseQuery(
        trpc.exercice.getDailyChallenge.queryOptions()
    );

    const { mutateAsync: executeCode } = useMutation(
        trpc.exercice.executeCode.mutationOptions()
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

    useEffect(() => {
        if (!dailyChallenge) return;
        setCode(dailyChallenge.defaultCode);
    }, [dailyChallenge]);

    if (!dailyChallenge) return <EmptyState />;

    return (
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[1fr_4px_1fr] grid-rows-[auto_20px_auto] md:grid-rows-1">
            <div className="flex flex-col p-4 pb-2 md:pb-4">
                <h1 className="text-title-h6 font-bold">
                    {dailyChallenge.title}
                </h1>
                <p className="text-paragraph-sm text-text-sub-600">
                    {dailyChallenge.description}
                </p>

                <DifficultyBadge
                    difficulty={dailyChallenge.difficulty ?? ""}
                    variant="filled"
                    size="medium"
                    className="mt-2 w-fit"
                />

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
                                        onClick={() => handleRunExample(index)}
                                    >
                                        <Button.Icon
                                            as={RiArrowRightCircleLine}
                                        />
                                        {t("run")}
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
                                    <p className="text-paragraph-sm text-text-sub-600">
                                        {exampleTests[index].success
                                            ? t("got")
                                            : t("error")}
                                        <code
                                            className={cn(
                                                "text-paragraph-sm bg-bg-soft-200 rounded-md p-1 ms-2",
                                                exampleTests[index]?.success
                                                    ? exampleTests[index]
                                                          ?.result ==
                                                      dailyChallenge
                                                          .exampleOutputs?.[
                                                          index
                                                      ]
                                                        ? "text-success-base"
                                                        : "text-warning-base"
                                                    : "text-error-base"
                                            )}
                                        >
                                            {exampleTests[index]?.success
                                                ? exampleTests[index]?.result
                                                : exampleTests[index]?.error}
                                        </code>
                                    </p>
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
        </div>
    );
}
