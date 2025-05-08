"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiUserLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as FancyButton from "@/components/ui/fancy-button";
import { FormMessage } from "@/components/ui/form";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { personalSchema } from "@/validator/onboarding";

import { useStepStore, useOnboardingStore } from "./store";

export function PersonalForm() {
    const t = useTranslations("auth");

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState, setError } = useForm({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            username: "",
            fullName: "",
        },
    });

    const { setOnboardingStore } = useOnboardingStore();

    const { nextStep } = useStepStore();

    const trpc = useTRPC();

    const { mutateAsync: checkUsernameExists } = useMutation(
        trpc.user.checkUsernameExists.mutationOptions()
    );

    const onSubmit = async (values: z.infer<typeof personalSchema>) => {
        setIsLoading(true);
        const { username, fullName } = values;

        const exists = await checkUsernameExists({ username });

        if (exists) {
            setIsLoading(false);
            setError("username", {
                type: "manual",
                message: t("onboarding.errors.usernameExists"),
            });
            return;
        }

        setOnboardingStore({
            username,
            fullName,
        });
        nextStep();
    };

    return (
        <div className="w-full max-w-[472px] px-4 mx-auto">
            <section>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-6"
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label.Root htmlFor="username">
                                {t("common.labels.username")} <Label.Asterisk />
                            </Label.Root>
                            <Input.Root hasError={!!formState.errors.username}>
                                <Input.Wrapper>
                                    <Input.Icon as={RiUserLine} />
                                    <Input.Input
                                        {...register("username")}
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder={t(
                                            "common.labels.username"
                                        )}
                                        required
                                    />
                                </Input.Wrapper>
                            </Input.Root>
                            <FormMessage>
                                {formState.errors.username?.message}
                            </FormMessage>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label.Root htmlFor="fullName">
                                {t("common.labels.fullName")} <Label.Asterisk />
                            </Label.Root>
                            <Input.Root hasError={!!formState.errors.fullName}>
                                <Input.Wrapper>
                                    <Input.Icon as={RiUserLine} />
                                    <Input.Input
                                        {...register("fullName")}
                                        id="fullName"
                                        type="text"
                                        autoComplete="fullName"
                                        placeholder="John Doe"
                                        required
                                    />
                                </Input.Wrapper>
                            </Input.Root>
                            <FormMessage>
                                {formState.errors.fullName?.message}
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
