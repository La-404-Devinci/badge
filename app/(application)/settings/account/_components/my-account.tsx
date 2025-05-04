"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine, RiMailCheckFill } from "@remixicon/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AvatarUploader } from "@/components/custom/avatar-uploader";
import { SaveButton } from "@/components/custom/save-button";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import { FormGlobalMessage, FormMessage } from "@/components/ui/form";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import { AUTH_ERRORS } from "@/constants/auth-errors";
import { PROJECT } from "@/constants/project";
import { authClient } from "@/lib/auth/client";
import { useTRPC } from "@/trpc/client";

// Define the validation schema for profile updates
const profileUpdateSchema = (
    t: ReturnType<typeof useTranslations<"settings.account.myAccountSettings">>
) =>
    z.object({
        name: z.string().min(2, t("nameValidation")),
        email: z.string().email(t("emailValidation")),
        phone: z.string().optional(),
    });

type ProfileFormValues = z.infer<ReturnType<typeof profileUpdateSchema>>;

export default function MyAccountSettings() {
    // Get the tRPC client
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Use suspense query to get session data (prefetched in page.tsx)
    const { data: user, error: sessionError } = useSuspenseQuery(
        trpc.user.getMe.queryOptions()
    );

    const commonT = useTranslations("common");
    const t = useTranslations("settings.account.myAccountSettings");
    const uniqueId = React.useId();
    const [globalError, setGlobalError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Store the initial values for reset
    const initialValues = React.useMemo(
        () => ({
            name: user?.name ?? "",
            email: user?.email ?? "",
        }),
        [user]
    );

    const invalidateQueries = () => {
        queryClient.invalidateQueries({
            queryKey: [["user"]],
        });
        queryClient.invalidateQueries({
            queryKey: [["organization"]],
        });
    };
    const { register, handleSubmit, reset, formState, setError } =
        useForm<ProfileFormValues>({
            resolver: zodResolver(profileUpdateSchema(t)),
            defaultValues: initialValues,
        });

    const handleSave = async (values: ProfileFormValues) => {
        setGlobalError(null);
        setIsSubmitting(true);

        try {
            if (formState.dirtyFields.email) {
                await authClient.changeEmail(
                    {
                        newEmail: values.email,
                        callbackURL: "/settings/account?email-updated=true",
                    },
                    {
                        onSuccess() {
                            // Reset form only on success
                            reset({
                                name: values.name,
                                email: values.email,
                                phone: values.phone,
                            });

                            setMessage(t("emailVerificationSent"));
                        },
                        onError(context) {
                            if (
                                context.error.code ===
                                AUTH_ERRORS.EMAIL_ALREADY_IN_USE
                            ) {
                                setError("email", {
                                    message: t("emailAlreadyInUse"),
                                });
                            } else if (
                                context.error.code ===
                                AUTH_ERRORS.COULDNT_UPDATE_YOUR_EMAIL
                            ) {
                                setError("email", {
                                    message: t("emailUpdateError"),
                                });
                            } else {
                                setGlobalError(
                                    `Please contact ${PROJECT.HELP_EMAIL} with error code: ${context.error.code}`
                                );
                            }
                        },
                    }
                );
            } else {
                await authClient.updateUser(
                    {
                        name: values.name,
                    },
                    {
                        onSuccess() {
                            reset({
                                name: values.name,
                                email: values.email,
                            });
                        },
                        onError({ error }) {
                            setGlobalError(
                                `Please contact ${PROJECT.HELP_EMAIL} with error code: ${error.code}`
                            );
                        },
                    }
                );
            }

            invalidateQueries();
        } catch (error) {
            setGlobalError(
                `Please contact ${PROJECT.HELP_EMAIL} with error code: ${error}`
            );
        } finally {
            setIsSubmitting(false);
            queryClient.invalidateQueries({
                queryKey: [["user"]],
            });
        }
    };

    const handleDiscard = () => {
        // Reset form to original values
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
            });
        }
    };

    const handleAvatarChange = async (avatarUrl: string) => {
        try {
            await authClient.updateUser({
                image: avatarUrl,
            });
            invalidateQueries();
        } catch (error) {
            setGlobalError(
                `Please contact ${PROJECT.HELP_EMAIL} with error code: ${error}`
            );
        }
    };

    // Error state
    if (sessionError) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-6 rounded-lg border border-error-light bg-error-lighter p-8">
                <div className="flex flex-col items-center gap-4">
                    <RiErrorWarningLine className="size-12 text-error-base" />
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-label-lg text-error-dark">
                            {t("sessionError")}
                        </h3>
                        <p className="text-paragraph-md text-error-base">
                            {t("profileLoadError")}
                        </p>
                    </div>
                </div>
                <Button.Root
                    variant="error"
                    mode="filled"
                    size="xsmall"
                    onClick={() => window.location.reload()}
                    className="w-full max-w-[200px]"
                >
                    {commonT("reloadPage")}
                </Button.Root>
            </div>
        );
    }

    const displayAvatar = user?.image;
    const isDirty = formState.isDirty;

    return (
        <div className="flex w-full flex-col gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col gap-4">
                <AvatarUploader
                    username={user?.name ?? "Unknown User"}
                    currentAvatar={displayAvatar}
                    onAvatarChange={handleAvatarChange}
                    size="64"
                />

                <Divider.Root variant="line-spacing" />
            </div>

            {/* Personal Information */}
            <form
                onSubmit={handleSubmit(handleSave)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-fullname`}>
                            {t("name")} <Label.Asterisk />
                        </Label.Root>

                        <Input.Root hasError={!!formState.errors.name}>
                            <Input.Wrapper>
                                <Input.Input
                                    id={`${uniqueId}-fullname`}
                                    {...register("name")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.name?.message}
                        </FormMessage>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-email`}>
                            {t("emailAddress")} <Label.Asterisk />
                        </Label.Root>

                        <Input.Root hasError={!!formState.errors.email}>
                            <Input.Wrapper>
                                <Input.Input
                                    id={`${uniqueId}-email`}
                                    type="email"
                                    {...register("email")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.email?.message}
                        </FormMessage>
                    </div>
                </div>

                <FormGlobalMessage variant="error">
                    {globalError}
                </FormGlobalMessage>

                {message && !globalError && (
                    <FormGlobalMessage variant="success" Icon={RiMailCheckFill}>
                        {message}
                    </FormGlobalMessage>
                )}

                <div className="mt-1 grid grid-cols-2 gap-3">
                    <Button.Root
                        variant="neutral"
                        mode="stroke"
                        type="button"
                        disabled={!isDirty || isSubmitting}
                        onClick={handleDiscard}
                    >
                        {commonT("discard")}
                    </Button.Root>
                    <SaveButton
                        isDirty={isDirty}
                        isPending={isSubmitting}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
}
