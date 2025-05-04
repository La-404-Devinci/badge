"use client";

import { RiGithubFill } from "@remixicon/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import * as Button from "@/components/ui/button";

export default function Home() {
    const t = useTranslations();
    return (
        <div className="container mx-auto flex-1 px-5">
            <div className="mt-48 flex flex-col items-center">
                <h1 className="max-w-3xl text-balance text-center text-title-h3 text-text-strong-950">
                    {t("landing.title")}
                </h1>

                <div className="mt-6 flex gap-4">
                    <Button.Root variant="neutral" asChild>
                        <a
                            href="https://github.com/impulse-studio/nextjs-boilerplate"
                            target="_blank"
                        >
                            <Button.Icon as={RiGithubFill} />
                            Star on GitHub
                        </a>
                    </Button.Root>

                    <Button.Root variant="neutral" mode="stroke" asChild>
                        <Link
                            href="https://www.alignui.com/docs"
                            target="_blank"
                        >
                            Visit AlignUI docs
                        </Link>
                    </Button.Root>
                </div>

                <div className="mt-12">
                    <h2 className="text-lg text-text-primary font-semibold">
                        What&apos;s Included:
                    </h2>
                    <ul className="ml-6 mt-3 flex list-disc flex-col gap-2 font-mono text-paragraph-sm font-medium text-text-sub-600">
                        <li>Tailwind setup with AlignUI tokens.</li>
                        <li>
                            Base components are stored in{" "}
                            <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                                /components/ui
                            </code>{" "}
                            folder.
                        </li>
                        <li>
                            Utils are stored in{" "}
                            <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                                /utils
                            </code>{" "}
                            folder.
                        </li>
                        <li>
                            Custom hooks are stored in{" "}
                            <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                                /hooks
                            </code>{" "}
                            folder.
                        </li>
                        <li>Dark mode setup.</li>
                        <li>Geist sans and mono font setup.</li>
                        <li>SEO optimization setup.</li>
                        <li>
                            Impulse Studio&apos;s recommended ESLint & Prettier
                            config.
                        </li>
                        <li>
                            Better auth with built-in{" "}
                            <Link
                                href="/sign-in"
                                className="text-primary-base hover:underline"
                            >
                                sign in
                            </Link>
                            ,{" "}
                            <Link
                                href="/sign-up"
                                className="text-primary-base hover:underline"
                            >
                                sign up
                            </Link>
                            ,{" "}
                            <Link
                                href="/forgot-password"
                                className="text-primary-base hover:underline"
                            >
                                forgot password
                            </Link>
                            , and{" "}
                            <Link
                                href="/reset-password"
                                className="text-primary-base hover:underline"
                            >
                                reset password
                            </Link>{" "}
                            pages
                        </li>
                        <li>
                            Onboarding UI flow at{" "}
                            <Link
                                href="/onboarding"
                                className="text-primary-base hover:underline"
                            >
                                onboarding
                            </Link>
                        </li>
                        <li>Drizzle and Posgresql</li>
                        <li>
                            Trigger.dev for serverless tasks, try triggering{" "}
                            <a
                                href="/api/trigger/test-trigger"
                                className="text-primary-base hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fetch("/api/trigger/test-trigger");
                                }}
                            >
                                test-trigger
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
