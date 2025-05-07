"use client";

import { useState } from "react";

import { RiUser3Line, RiBriefcase3Line } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { RadioCard, RadioCardGroup } from "@/components/custom/radio-card";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as FancyButton from "@/components/ui/fancy-button";

import { useOnboardingStore, useStepStore } from "./store";

const ROLES = [
    {
        value: "employee",
        title: "onboarding.roleSelection.employee.title",
        description: "onboarding.roleSelection.employee.description",
        icon: <RiUser3Line className="h-6 w-6 text-primary-base" />,
    },
    {
        value: "employer",
        title: "onboarding.roleSelection.employer.title",
        description: "onboarding.roleSelection.employer.description",
        icon: <RiBriefcase3Line className="h-6 w-6 text-primary-base" />,
    },
];

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
            <RadioCardGroup
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="w-full max-w-[472px]"
            >
                {ROLES.map((role) => (
                    <div
                        key={role.value}
                        onClick={() => handleCardClick(role.value)}
                    >
                        <RadioCard
                            value={role.value}
                            title={t(role.title)}
                            description={t(role.description)}
                            icon={role.icon}
                            selected={selectedRole === role.value}
                        />
                    </div>
                ))}
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
