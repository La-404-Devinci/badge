"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningFill, RiInformationFill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordInput } from "@/app/(auth)/_components/password-input";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Alert from "@/components/ui/alert";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import { FormMessage } from "@/components/ui/form";
import * as Hint from "@/components/ui/hint";
import * as Label from "@/components/ui/label";
import { AUTH_ERRORS } from "@/constants/auth-errors";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

const deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required"),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export default function DeleteAccount() {
    const commonT = useTranslations("common");
    const t = useTranslations("settings.privacySecurity.deleteAccount");
    const uniqueId = React.useId();
    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFormError,
    } = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountSchema),
        defaultValues: {
            password: "",
        },
    });

    async function onSubmit(data: DeleteAccountFormValues) {
        setError(null);
        setIsSubmitting(true);

        await authClient.deleteUser(
            {
                password: data.password,
            },
            {
                onError: ({ error }) => {
                    if (error.code === AUTH_ERRORS.INVALID_PASSWORD) {
                        setFormError("password", {
                            message: t("invalidPassword"),
                        });
                    } else {
                        setError(t("error"));
                    }
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    router.push(
                        PAGES.SIGN_IN +
                            "?message=" +
                            encodeURIComponent(t("successMessage"))
                    );
                },
            }
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <div className="text-label-md">{t("title")}</div>
                <p className="mt-1 text-paragraph-sm text-text-sub-600">
                    {t("description")}
                </p>
            </div>

            <Divider.Root variant="line-spacing" />

            <Alert.Root variant="lighter" status="error" size="xsmall">
                <Alert.Icon as={RiErrorWarningFill} />
                {t("warningCannotUndo")}
            </Alert.Root>

            <p className="text-paragraph-sm text-text-sub-600">
                {t("warningDataRemoval")}
                <br />
                <br />
                {t("confirmationText")}
            </p>

            <Divider.Root variant="line-spacing" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-1">
                    <Label.Root htmlFor={`${uniqueId}-confirm`}>
                        {t("confirmDeletion")} <Label.Asterisk />
                    </Label.Root>

                    <PasswordInput
                        id={`${uniqueId}-confirm`}
                        hasError={!!errors.password}
                        {...register("password")}
                    />

                    {errors.password && (
                        <FormMessage>{errors.password.message}</FormMessage>
                    )}

                    {error && (
                        <Alert.Root
                            variant="lighter"
                            status="error"
                            size="xsmall"
                        >
                            <Alert.Icon as={RiErrorWarningFill} />
                            {error}
                        </Alert.Root>
                    )}

                    {!error && !errors.password && (
                        <Hint.Root>
                            <Hint.Icon as={RiInformationFill} />
                            {t("passwordHint")}
                        </Hint.Root>
                    )}
                </div>

                <div className="mt-1 grid grid-cols-2 gap-3">
                    <Button.Root variant="neutral" mode="stroke" type="button">
                        {commonT("cancel")}
                    </Button.Root>
                    <Button.Root
                        variant="error"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <StaggeredFadeLoader variant="muted" />
                        )}
                        {isSubmitting ? commonT("loading") : t("title")}
                    </Button.Root>
                </div>
            </form>
        </div>
    );
}
