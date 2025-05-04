"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiErrorWarningLine, RiInformationFill } from "@remixicon/react";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SaveButton } from "@/components/custom/save-button";
import * as Alert from "@/components/ui/alert";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import { FormGlobalMessage } from "@/components/ui/form";
import * as Label from "@/components/ui/label";
import * as Switch from "@/components/ui/switch";
import type { NotificationSettings } from "@/db/schema";
import { useTRPC } from "@/trpc/client";

// Types dérivés de NotificationSettings pour le formulaire
type NotificationPreferencesFormValues = Pick<
    NotificationSettings,
    | "newsUpdatesEnabled"
    | "promotionsOffersEnabled"
    | "remindersSystemAlertsEnabled"
>;

// Schéma de validation pour le formulaire
const preferencesSchema = z.object({
    newsUpdatesEnabled: z.boolean(),
    promotionsOffersEnabled: z.boolean(),
    remindersSystemAlertsEnabled: z.boolean(),
});

export default function Preferences() {
    const uniqueId = React.useId();
    const t = useTranslations("settings.notificationSettings.preferences");
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
            newsUpdatesEnabled: settings?.newsUpdatesEnabled ?? true,
            promotionsOffersEnabled: settings?.promotionsOffersEnabled ?? false,
            remindersSystemAlertsEnabled:
                settings?.remindersSystemAlertsEnabled ?? true,
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
    } = useForm<NotificationPreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            newsUpdatesEnabled: settings?.newsUpdatesEnabled ?? true,
            promotionsOffersEnabled: settings?.promotionsOffersEnabled ?? false,
            remindersSystemAlertsEnabled:
                settings?.remindersSystemAlertsEnabled ?? true,
        },
    });

    // Update settings mutation using tRPC with TanStack Query
    const { mutateAsync: updateSettings } = useMutation(
        trpc.notification.updateNotificationSettings.mutationOptions()
    );

    // Handle switch toggle - Update form values only, don't call server yet
    const handleToggle = (
        settingName: keyof NotificationPreferencesFormValues,
        checked: boolean
    ) => {
        setValue(settingName, checked, { shouldDirty: true });
    };

    // Handle save
    const onSubmit = async (data: NotificationPreferencesFormValues) => {
        setGlobalError(null);

        try {
            // Save all changes at once
            await updateSettings(data);
            reset(data);
            // Refresh data from server
            await queryClient.invalidateQueries(
                trpc.notification.getUserNotificationSettings.queryOptions()
            );
        } catch (error) {
            console.error("Error saving notification preferences:", error);
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
                        <Switch.Root
                            id={`${uniqueId}-news`}
                            checked={watch("newsUpdatesEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle("newsUpdatesEnabled", checked)
                            }
                            {...register("newsUpdatesEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-news`}
                        >
                            {t("newsUpdates.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("newsUpdates.description")}
                            </div>
                        </Label.Root>
                    </div>

                    <div className="flex items-start gap-2">
                        <Switch.Root
                            id={`${uniqueId}-reminders`}
                            checked={watch("remindersSystemAlertsEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle(
                                    "remindersSystemAlertsEnabled",
                                    checked
                                )
                            }
                            {...register("remindersSystemAlertsEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-reminders`}
                        >
                            {t("remindersEvents.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("remindersEvents.description")}
                            </div>
                        </Label.Root>
                    </div>

                    <div className="flex items-start gap-2">
                        <Switch.Root
                            id={`${uniqueId}-promotions`}
                            checked={watch("promotionsOffersEnabled")}
                            onCheckedChange={(checked) =>
                                handleToggle("promotionsOffersEnabled", checked)
                            }
                            {...register("promotionsOffersEnabled")}
                        />
                        <Label.Root
                            className="flex-col items-start gap-1"
                            htmlFor={`${uniqueId}-promotions`}
                        >
                            {t("promotionsOffers.label")}
                            <div className="text-paragraph-xs text-text-sub-600">
                                {t("promotionsOffers.description")}
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
