"use client";

import { useState } from "react";

import { RiUser3Line, RiBriefcase3Line } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { RadioCard, RadioCardGroup } from "@/components/custom/radio-card";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as FancyButton from "@/components/ui/fancy-button";

import { useOnboardingStore, useStepStore } from "./store";

export function RoleSelection() {
    const t = useTranslations("auth");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const { setOnboardingStore } = useOnboardingStore();
    const { nextStep } = useStepStore();

    const handleContinue = () => {
        if (!selectedRole) return;

        setIsLoading(true);
        setOnboardingStore({
            role: selectedRole,
        });
        nextStep();
    };

    const handleCardClick = (role: string) => {
        setSelectedRole(role);
    };

    return (
        <div className="flex w-full flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-semibold text-static-black">
                    {t("onboarding.roleSelection.title")}
                </h1>
                <p className="text-static-black/70">
                    {t("onboarding.roleSelection.description")}
                </p>
            </div>

            <RadioCardGroup
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="w-full max-w-[472px]"
            >
                <div onClick={() => handleCardClick("employee")}>
                    <RadioCard
                        value="employee"
                        title={t("onboarding.roleSelection.employee.title")}
                        description={t(
                            "onboarding.roleSelection.employee.description"
                        )}
                        icon={
                            <RiUser3Line className="h-6 w-6 text-primary-base" />
                        }
                        selected={selectedRole === "employee"}
                    />
                </div>

                <div onClick={() => handleCardClick("employer")}>
                    <RadioCard
                        value="employer"
                        title={t("onboarding.roleSelection.employer.title")}
                        description={t(
                            "onboarding.roleSelection.employer.description"
                        )}
                        icon={
                            <RiBriefcase3Line className="h-6 w-6 text-primary-base" />
                        }
                        selected={selectedRole === "employer"}
                    />
                </div>
            </RadioCardGroup>

            <FancyButton.Root
                variant="primary"
                size="medium"
                className="w-full max-w-[472px]"
                disabled={!selectedRole || isLoading}
                onClick={handleContinue}
            >
                {isLoading && <StaggeredFadeLoader variant="muted" />}
                {isLoading
                    ? t("common.loading.submitting")
                    : t("common.buttons.continue")}
            </FancyButton.Root>
        </div>
    );
}
