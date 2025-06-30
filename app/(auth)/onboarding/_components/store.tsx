import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { ONBOARDING_STEPS } from "../layout";

const MAX_STEP = ONBOARDING_STEPS.length - 1;
const MIN_STEP = 0;

interface StepState {
    activeStep: number;
    prevStep: () => void;
    nextStep: () => void;
    setActiveStep: (step: number) => void;
}

interface OnboardingState {
    fullName: string;
    username: string;
    position?: string;
    biography?: string;
    role: boolean;
    setOnboardingStore: (
        data: Partial<
            Omit<OnboardingState, "setOnboardingStore" | "resetOnboardingStore">
        >
    ) => void;
    resetOnboardingStore: () => void;
}

export const useStepStore = create<StepState>((set, get) => ({
    activeStep: 0,
    prevStep: () => {
        const currentStep = get().activeStep;
        set({ activeStep: Math.max(currentStep - 1, MIN_STEP) });
    },
    nextStep: () => {
        const currentStep = get().activeStep;
        set({ activeStep: Math.min(currentStep + 1, MAX_STEP) });
    },
    setActiveStep: (step: number) => {
        set({ activeStep: step });
    },
}));

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            fullName: "",
            username: "",
            position: "",
            biography: "",
            role: false,
            setOnboardingStore: (data) =>
                set((state) => ({
                    ...state,
                    ...data,
                })),
            resetOnboardingStore: () =>
                set((state) => ({
                    ...state,
                    fullName: "",
                    username: "",
                    position: "",
                    biography: "",
                    role: false,
                })),
        }),
        {
            name: "onboarding",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
