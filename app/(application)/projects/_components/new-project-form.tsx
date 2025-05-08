"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useOnboardingStore } from "@/app/(auth)/onboarding/_components/store";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as FancyButton from "@/components/ui/fancy-button";
import { FormMessage } from "@/components/ui/form";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import * as Textarea from "@/components/ui/textarea";
import { PAGES } from "@/constants/pages";
import { useTRPC } from "@/trpc/client";
import { positionSchema } from "@/validator/onboarding";

export function NewProjectForm() {
    const t = useTranslations("auth");
    const router = useRouter();
    const trpc = useTRPC();

    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, formState, setValue, watch } = useForm({
        resolver: zodResolver(positionSchema),
        defaultValues: {
            position: "",
            biography: "",
        },
    });

    const onboardingStore = useOnboardingStore.getState();
    const { setOnboardingStore, resetOnboardingStore } = useOnboardingStore();

    const { mutateAsync: updateUser } = useMutation(
        trpc.user.updateUserProfile.mutationOptions({
            onSuccess: () => {
                setIsLoading(false);
                router.push(PAGES.DASHBOARD);
            },
        })
    );
    const onSubmit = async (values: z.infer<typeof positionSchema>) => {
        setIsLoading(true);
        const { position, biography } = values;
        console.log(position);
        setOnboardingStore({
            position,
            biography,
        });

        await updateUser({
            ...onboardingStore,
            position,
            biography,
        });

        resetOnboardingStore();
    };

    const positionOptions = [
        { label: "Developer", value: "developer" },
        { label: "Designer", value: "designer" },
        { label: "Student", value: "student" },
        { label: "QA", value: "qa" },
        { label: "Product Manager", value: "product-manager" },
        { label: "Project Manager", value: "project-manager" },
        { label: "Sales", value: "sales" },
        { label: "Marketing", value: "marketing" },
        { label: "HR", value: "hr" },
        { label: "Other", value: "other" },
    ];

    const position = watch("position");
    const biography = watch("biography");

    return (
        <div className="w-full px-4">
            <section>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-6"
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label.Root htmlFor="position">
                                {t("onboarding.position.labels.position")}
                                <Label.Asterisk />
                            </Label.Root>

                            <Select.Root
                                value={position}
                                onValueChange={(value) =>
                                    setValue("position", value)
                                }
                                hasError={!!formState.errors.position}
                            >
                                <Select.Trigger>
                                    <Select.Value placeholder="Select a position" />
                                </Select.Trigger>
                                <Select.Content>
                                    {positionOptions.map((option) => (
                                        <Select.Item
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                            <FormMessage>
                                {formState.errors.position?.message}
                            </FormMessage>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label.Root htmlFor="fullName">
                                {t("common.labels.fullName")} <Label.Asterisk />
                            </Label.Root>
                            <Textarea.Root
                                placeholder="Jot down your thoughts..."
                                value={biography}
                                onChange={(e) =>
                                    setValue("biography", e.target.value)
                                }
                            >
                                <Textarea.CharCounter
                                    current={biography.length}
                                    max={200}
                                />
                            </Textarea.Root>

                            <FormMessage>
                                {formState.errors.biography?.message}
                            </FormMessage>
                        </div>
                    </div>

                    <FancyButton.Root
                        variant="primary"
                        size="medium"
                        disabled={isLoading}
                    >
                        {isLoading && <StaggeredFadeLoader variant="muted" />}
                        {isLoading
                            ? t("common.loading.submitting")
                            : t("common.buttons.continue")}
                    </FancyButton.Root>
                </form>
            </section>
        </div>
    );
}
