"use client";
import * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";
import { RiUserLine } from "@remixicon/react";
import Link from "next/link";

import * as Checkbox from "@/components/ui/checkbox";
import * as FancyButton from "@/components/ui/fancy-button";
import * as LinkButton from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

import { SignInForm } from "./_components/sign-in-form";

export default function PageLogin() {
    return (
        <>
            <div className="flex flex-col items-center gap-2">
                {/* icon */}
                <div
                    className={cn(
                        "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-20",
                        // bg
                        "before:absolute before:inset-0 before:rounded-full",
                        "before:bg-gradient-to-b before:from-primary-base before:to-transparent before:opacity-10"
                    )}
                >
                    <div
                        className="relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200 lg:size-14"
                        style={{
                            boxShadow:
                                "0 0 0 1px rgba(183, 83, 16, 0.04), 0 1px 1px 0.5px rgba(183, 83, 16, 0.04), 0 3px 3px -1.5px rgba(183, 83, 16, 0.02), 0 6px 6px -3px rgba(183, 83, 16, 0.04), 0 12px 12px -6px rgba(183, 83, 16, 0.04), 0px 24px 24px -12px rgba(183, 83, 16, 0.04), 0px 48px 48px -24px rgba(183, 83, 16, 0.04), inset 0px -1px 1px -0.5px rgba(183, 83, 16, 0.06)",
                        }}
                    >
                        <RiUserLine className="size-6 text-warning-base lg:size-7" />
                    </div>
                </div>

                <div className="space-y-1 text-center">
                    <div className="font-inter-var text-title-h6 lg:text-title-h5">
                        Login to your account
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600 lg:text-paragraph-md">
                        Enter your details to login.
                    </div>
                </div>
            </div>

            <div className="grid w-full auto-cols-fr grid-flow-col gap-3">
                <SignInForm />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-2">
                    <Checkbox.Root id="agree" />
                    <LabelPrimitive.Root
                        htmlFor="agree"
                        className="block cursor-pointer text-paragraph-sm"
                    >
                        Keep me logged in
                    </LabelPrimitive.Root>
                </div>
                <LinkButton.Root variant="gray" size="medium" underline asChild>
                    <Link href="/reset-password">Forgot password?</Link>
                </LinkButton.Root>
            </div>

            <FancyButton.Root variant="primary" size="medium">
                Login
            </FancyButton.Root>
        </>
    );
}
