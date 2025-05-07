import { create } from "zustand";

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
    personalInfo: {
        fullName: string;
        username: string;
    };
    position?: string;
    biography?: string;
    setOnboardingStore: (
        data: Partial<Omit<OnboardingState, "setOnboardingStore">>
    ) => void;
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

export const useOnboardingStore = create<OnboardingState>((set) => ({
    personalInfo: {
        fullName: "",
        username: "",
    },
    position: "",
    biography: "",
    setOnboardingStore: (data) =>
        set((state) => ({
            ...state,
            ...data,
        })),
}));
