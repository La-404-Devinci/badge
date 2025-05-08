"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine, RiMailCheckFill } from "@remixicon/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
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
import * as Textarea from "@/components/ui/textarea";
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
        username: z.string().min(2, t("usernameValidation")),
        biography: z.string().min(2, t("biographyValidation")),
    });

type ProfileFormValues = z.infer<ReturnType<typeof profileUpdateSchema>>;

type UserWithProfile = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string | null;
    banned: boolean | null;
    banReason: string | null;
    banExpires: Date | null;
    username: string;
    biography: string;
};

export default function MyAccountSettings() {
    // Get the tRPC client
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Use suspense query to get session data (prefetched in page.tsx)
    const { data: userRaw, error: sessionError } = useSuspenseQuery(
        trpc.user.getMe.queryOptions()
    );
    // Cast pour inclure username et biography
    const user = userRaw as UserWithProfile;

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
            username: user?.username ?? "",
            biography: user?.biography ?? "",
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
    const {
        register,
        handleSubmit,
        reset,
        formState,
        setError,
        watch,
        setValue,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileUpdateSchema(t)),
        defaultValues: initialValues,
    });

    const biography = watch("biography") || "";

    // Ajout des mutations tRPC pour username et update profile
    const { mutateAsync: checkUsernameExists } = useMutation(
        trpc.user.checkUsernameExists.mutationOptions()
    );
    const { mutateAsync: updateUserProfile } = useMutation(
        trpc.user.updateUserProfile.mutationOptions()
    );

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
                            reset({
                                name: values.name,
                                email: values.email,
                                username: values.username,
                                biography: values.biography,
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
                // Vérification du username si modifié
                if (formState.dirtyFields.username) {
                    const usernameExists = await checkUsernameExists({
                        username: values.username,
                    });
                    if (usernameExists) {
                        setError("username", {
                            message: t("usernameAlreadyInUse"),
                        });
                        setIsSubmitting(false);
                        return;
                    }
                }
                // Appel mutation tRPC pour mettre à jour le profil
                await updateUserProfile({
                    fullName: values.name,
                    username: values.username,
                    biography: values.biography,
                });
                reset({
                    name: values.name,
                    email: values.email,
                    username: values.username,
                    biography: values.biography,
                });
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
                username: user.username || "",
                biography: user.biography || "",
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
                        <Label.Root htmlFor={`${uniqueId}-username`}>
                            {t("username")} <Label.Asterisk />
                        </Label.Root>

                        <Input.Root hasError={!!formState.errors.username}>
                            <Input.Wrapper>
                                <Input.Input
                                    id={`${uniqueId}-username`}
                                    {...register("username")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.username?.message}
                        </FormMessage>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-biography`}>
                            {t("biography")}
                        </Label.Root>

                        <Textarea.Root
                            placeholder="Jot down your thoughts..."
                            value={biography}
                            onChange={(e) =>
                                setValue("biography", e.target.value, {
                                    shouldDirty: true,
                                })
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
