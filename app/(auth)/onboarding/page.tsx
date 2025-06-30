"use client";

import PersonalStep from "./_components/personal-step";
import RoleStep from "./_components/role-step";
import { useStepStore } from "./_components/store";

export default function Onboarding() {
    const { activeStep } = useStepStore();
    return (
        <div className="w-full">
            <div className="flex flex-col gap-6 mt-12">
                {activeStep === 0 && <PersonalStep />}
                {activeStep === 1 && <RoleStep />}
                {activeStep === 2 && <p>Connexion</p>}
            </div>
        </div>
    );
}
