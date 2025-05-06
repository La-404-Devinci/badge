"use client";

import { RiArrowLeftSLine } from "@remixicon/react";
import Link from "next/link";

import * as Button from "@/components/ui/button";

import { useStepStore } from "./store";

export default function BackButton() {
    const { prevStep, activeStep } = useStepStore();

    return (
        <>
            {activeStep === 0 ? (
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    size="xsmall"
                    asChild
                >
                    <Link href="/onboarding">
                        <Button.Icon as={RiArrowLeftSLine} />
                        Back
                    </Link>
                </Button.Root>
            ) : (
                <Button.Root
                    variant="neutral"
                    mode="stroke"
                    size="xsmall"
                    onClick={prevStep}
                >
                    <Button.Icon as={RiArrowLeftSLine} />
                    Back
                </Button.Root>
            )}
        </>
    );
}
