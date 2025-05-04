"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationFill, RiErrorWarningLine } from "@remixicon/react";
import {
    useMutation,
    useSuspenseQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SaveButton } from "@/components/custom/save-button";
import * as Alert from "@/components/ui/alert";
import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Divider from "@/components/ui/divider";
import { FormGlobalMessage } from "@/components/ui/form";
import * as Label from "@/components/ui/label";
import type { NotificationSettings } from "@/db/schema";
import { useTRPC } from "@/trpc/client";

// Types dérivés de NotificationSettings pour le formulaire
type NotificationMethodFormValues = Pick<
    NotificationSettings,
    "emailEnabled" | "pushEnabled" | "smsEnabled"
>;

// Schéma de validation pour le formulaire
const methodSchema = z.object({
    emailEnabled: z.boolean(),
    pushEnabled: z.boolean(),
    smsEnabled: z.boolean(),
});

export default function Method() {
    const uniqueId = React.useId();
    const t = useTranslations("settings.notificationSettings.method");
    const tCommon = useTranslations("settings.notificationSettings.common");
    const commonT = useTranslations("common");

    // tRPC and Query Client
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // State management
    const [globalError, setGlobalError] = React.useState<string | null>(null);

    // Get notification settings using suspense query
    const { data: settings } = useSuspenseQuery(
        trpc.notification.getUserNotificationSettings.queryOptions()
    );

    // Store the initial values for reset
    const initialValues = React.useMemo(
        () => ({
            emailEnabled: settings?.emailEnabled ?? true,
            pushEnabled: settings?.pushEnabled ?? true,
            smsEnabled: settings?.smsEnabled ?? false,
        }),
        [settings]
    );

    // Form setup with React Hook Form - Define defaultValues directly instead of using initialValues
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isDirty, isSubmitting },
    } = useForm<NotificationMethodFormValues>({
        resolver: zodResolver(methodSchema),
        defaultValues: {
            emailEnabled: settings?.emailEnabled ?? true,
            pushEnabled: settings?.pushEnabled ?? true,
            smsEnabled: settings?.smsEnabled ?? false,
        },
    });

    // Update settings mutation using tRPC with TanStack Query
    const { mutateAsync: updateSettings } = useMutation(
        trpc.notification.updateNotificationSettings.mutationOptions()
    );

    // Handle toggle - Update form values only, don't call server yet
    const handleToggle = (
        settingName: keyof NotificationMethodFormValues,
        checked: boolean
    ) => {
        setValue(settingName, checked, { shouldDirty: true });
    };

    // Handle save
    const onSubmit = async (data: NotificationMethodFormValues) => {
        setGlobalError(null);

        try {
            // Save all changes at once
            await updateSettings(data);

            // Reset form with new data
            reset(data);

            // Refresh data from server with full queryOptions()
            await queryClient.invalidateQueries(
                trpc.notification.getUserNotificationSettings.queryOptions()
            );
        } catch (error) {
            console.error("Error saving notification methods:", error);
            setGlobalError(
                error instanceof Error ? error.message : tCommon("saveError")
            );
        }
    };

    // Handle discard
    const handleDiscard = () => {
        reset(initialValues);
        setGlobalError(null);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <div className="text-label-md">{t("title")}</div>
                <p className="mt-1 text-paragraph-sm text-text-sub-600">
                    {t("description")}
                </p>
            </div>

            <Divider.Root variant="line-spacing" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                        <Checkbox.Root
                            id={`${uniqueId}-email`}
                            checked={watch("emailEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle("emailEnabled", checked === true)
                            }
                            {...register("emailEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-email`}
                        >
                            {t("emailNotifications.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("emailNotifications.description")}
                            </div>
                        </Label.Root>
                    </div>

                    <div className="flex items-start gap-2">
                        <Checkbox.Root
                            id={`${uniqueId}-push`}
                            checked={watch("pushEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle("pushEnabled", checked === true)
                            }
                            {...register("pushEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-push`}
                        >
                            {t("pushNotifications.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("pushNotifications.description")}
                            </div>
                        </Label.Root>
                    </div>

                    <div className="flex items-start gap-2">
                        <Checkbox.Root
                            id={`${uniqueId}-sms`}
                            checked={watch("smsEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle("smsEnabled", checked === true)
                            }
                            {...register("smsEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-sms`}
                        >
                            {t("smsNotifications.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("smsNotifications.description")}
                            </div>
                        </Label.Root>
                    </div>
                </div>

                <Alert.Root
                    variant="lighter"
                    status="information"
                    size="xsmall"
                >
                    <Alert.Icon as={RiInformationFill} />
                    {tCommon("infoAlert")}
                </Alert.Root>

                {globalError && (
                    <FormGlobalMessage
                        variant="error"
                        Icon={RiErrorWarningLine}
                    >
                        {globalError}
                    </FormGlobalMessage>
                )}

                <div className="mt-1 grid grid-cols-2 gap-3">
                    <Button.Root
                        type="button"
                        variant="neutral"
                        mode="stroke"
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
