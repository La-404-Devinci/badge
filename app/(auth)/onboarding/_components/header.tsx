"use client";

import * as React from "react";

import { RiCloseLine } from "@remixicon/react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import * as Button from "@/components/ui/button";
import * as HorizontalStepper from "@/components/ui/horizontal-stepper";

import BackButton from "./back-button";
import { useStepStore } from "./store";
import { ONBOARDING_STEPS } from "../layout";

export default function Header() {
    const { activeStep } = useStepStore();

    const getState = (index: number) => {
        if (activeStep > index) return "completed";
        if (activeStep === index) return "active";
        return "default";
    };

    return (
        <div className="border-b border-stroke-soft-200 bg-bg-white-0 lg:h-[88px]">
            {/* mobile */}
            <div className="lg:hidden">
                <div className="px-2.5 pb-3.5 pt-2.5">
                    <div className="relative flex h-9 items-center justify-between">
                        <BackButton />
                        <Link
                            href="/"
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <Logo className="size-9" />
                        </Link>
                        <Button.Root variant="neutral" mode="ghost">
                            <Button.Icon as={RiCloseLine} />
                        </Button.Root>
                    </div>
                </div>
                <div className="h-1 w-full bg-bg-soft-200">
                    <div
                        className="h-full bg-primary-base transition-all duration-200 ease-out"
                        style={{
                            width: `${(100 / ONBOARDING_STEPS.length) * (activeStep + 1)}%`,
                        }}
                    />
                </div>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-5 items-center justify-center rounded-full bg-primary-base text-label-xs text-static-white">
                            {ONBOARDING_STEPS[activeStep].indicator}
                        </div>
                        <span className="text-paragraph-sm text-text-strong-950">
                            {ONBOARDING_STEPS[activeStep].label}
                        </span>
                    </div>
                    <div className="text-right text-paragraph-sm text-text-soft-400">
                        {activeStep + 1}/{ONBOARDING_STEPS.length}
                    </div>
                </div>
            </div>

            {/* desktop */}
            <div className="flex w-full justify-between items-center gap-6">
                <Link href="/">
                    <Logo className="size-10" />
                </Link>
                <div className="flex w-full justify-center">
                    <HorizontalStepper.Root>
                        {ONBOARDING_STEPS.map((step, index) => (
                            <React.Fragment key={index}>
                                <HorizontalStepper.Item state={getState(index)}>
                                    <HorizontalStepper.ItemIndicator>
                                        {step.indicator}
                                    </HorizontalStepper.ItemIndicator>
                                    {step.label}
                                </HorizontalStepper.Item>
                                {index < ONBOARDING_STEPS.length - 1 && (
                                    <HorizontalStepper.SeparatorIcon />
                                )}
                            </React.Fragment>
                        ))}
                    </HorizontalStepper.Root>
                </div>
            </div>
        </div>
    );
}
