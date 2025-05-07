"use client";

import BackButton from "./_components/back-button";
import PersonalStep from "./_components/personal-step";
import PositionStep from "./_components/position-step";
import RoleStep from "./_components/role-step";
import { useStepStore } from "./_components/store";

export default function Onboarding() {
    const { activeStep } = useStepStore();
    return (
        <div className="w-full">
            <BackButton />
            <div className="flex flex-col gap-6 mt-12">
                {activeStep === 0 && <PersonalStep />}
                {activeStep === 1 && <RoleStep />}
                {activeStep === 2 && <PositionStep />}
            </div>
        </div>
    );
}
