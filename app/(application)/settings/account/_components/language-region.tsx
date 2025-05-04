"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { SaveButton } from "@/components/custom/save-button";
import * as Button from "@/components/ui/button";
import * as Divider from "@/components/ui/divider";
import { InfoCircleFilled } from "@/components/ui/icons";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import * as Tooltip from "@/components/ui/tooltip";
import { userPreferencesSchema } from "@/db/schema/user-preferences";
import { useTRPC } from "@/trpc/client";

const langs = [
    {
        value: "en-US",
        flag: "/flags/US.svg",
        label: "English (US)",
    },
    {
        value: "fr-FR",
        flag: "/flags/FR.svg",
        label: "French (France)",
    },
] as const;

type FormValues = z.infer<typeof userPreferencesSchema>;

export default function LanguageRegion() {
    const uniqueId = React.useId();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const t = useTranslations("settings.account.languageRegionSettings");
    const commonT = useTranslations("common");

    // Fetch user preferences with suspense query
    const { data: preferences } = useSuspenseQuery(
        trpc.user.getUserPreferences.queryOptions()
    );

    // Store the initial values for reset
    const initialValues = React.useMemo(
        () => ({
            language: preferences?.language ?? "en-US",
            timezone: preferences?.timezone ?? "GMT-04:00",
            timeFormat: preferences?.timeFormat ?? null,
            dateFormat: preferences?.dateFormat ?? null,
        }),
        [preferences]
    );

    // Initialize form with values from the server
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(userPreferencesSchema),
        defaultValues: {
            language: preferences?.language ?? "en-US",
            timezone: preferences?.timezone ?? "GMT-04:00",
            timeFormat: preferences?.timeFormat ?? null,
            dateFormat: preferences?.dateFormat ?? null,
        },
    });

    // Save preferences mutation
    const { mutateAsync: savePreferences } = useMutation(
        trpc.user.saveUserPreferences.mutationOptions()
    );

    // Form submission handler
    const onSubmit = async (data: FormValues) => {
        try {
            await savePreferences(data);
            reset(data);
            queryClient.invalidateQueries(
                trpc.user.getUserPreferences.queryOptions()
            );

            // Check if language was changed
            if (data.language !== preferences?.language) {
                router.refresh();
            }
        } catch (error) {
            console.error("Error saving preferences:", error);
        }
    };

    // Handle discard changes
    const handleDiscard = () => {
        reset(initialValues, { keepDefaultValues: true });
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
                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-language`}>
                            {t("language")} <Label.Asterisk />
                        </Label.Root>

                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger id={`${uniqueId}-language`}>
                                        <Select.Value
                                            placeholder={t("selectLanguage")}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {langs.map(({ flag, label, value }) => (
                                            <Select.Item
                                                key={value}
                                                value={value}
                                            >
                                                <Select.ItemIcon
                                                    as="img"
                                                    src={flag}
                                                    alt={`${label} flag`}
                                                />
                                                {label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        {errors.language && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.language.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-timezone`}>
                            {t("timezone")} <Label.Asterisk />
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <InfoCircleFilled className="size-5 text-text-disabled-300" />
                                </Tooltip.Trigger>
                                <Tooltip.Content side="top" size="xsmall">
                                    {t("timezoneTooltip")}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Label.Root>

                        <Controller
                            name="timezone"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger id={`${uniqueId}-timezone`}>
                                        <Select.Value
                                            placeholder={t("selectTimezone")}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="GMT-12:00">
                                            {
                                                "GMT-12:00 - International Date Line West"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-11:00">
                                            {"GMT-11:00 - Midway Island, Samoa"}
                                        </Select.Item>
                                        <Select.Item value="GMT-10:00">
                                            {"GMT-10:00 - Hawaii"}
                                        </Select.Item>
                                        <Select.Item value="GMT-09:00">
                                            {"GMT-09:00 - Alaska"}
                                        </Select.Item>
                                        <Select.Item value="GMT-08:00">
                                            {
                                                "GMT-08:00 - Pacific Time (US & Canada)"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-07:00">
                                            {
                                                "GMT-07:00 - Mountain Time (US & Canada)"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-06:00">
                                            {
                                                "GMT-06:00 - Central Time (US & Canada)"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-05:00">
                                            {
                                                "GMT-05:00 - Eastern Time (US & Canada)"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-04:00">
                                            {
                                                "GMT-04:00 - Atlantic Standard Time (AST)"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT-03:00">
                                            {"GMT-03:00 - Buenos Aires"}
                                        </Select.Item>
                                        <Select.Item value="GMT-02:00">
                                            {"GMT-02:00 - Mid-Atlantic"}
                                        </Select.Item>
                                        <Select.Item value="GMT-01:00">
                                            {"GMT-01:00 - Azores"}
                                        </Select.Item>
                                        <Select.Item value="GMT+00:00">
                                            {"GMT+00:00 - London, Lisbon"}
                                        </Select.Item>
                                        <Select.Item value="GMT+01:00">
                                            {"GMT+01:00 - Paris, Madrid"}
                                        </Select.Item>
                                        <Select.Item value="GMT+02:00">
                                            {"GMT+02:00 - Athens, Bucharest"}
                                        </Select.Item>
                                        <Select.Item value="GMT+03:00">
                                            {
                                                "GMT+03:00 - Moscow, St. Petersburg"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT+04:00">
                                            {"GMT+04:00 - Baku, Tbilisi"}
                                        </Select.Item>
                                        <Select.Item value="GMT+05:00">
                                            {"GMT+05:00 - Tashkent, Islamabad"}
                                        </Select.Item>
                                        <Select.Item value="GMT+06:00">
                                            {"GMT+06:00 - Almaty, Dhaka"}
                                        </Select.Item>
                                        <Select.Item value="GMT+07:00">
                                            {
                                                "GMT+07:00 - Bangkok, Hanoi, Jakarta"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT+08:00">
                                            {
                                                "GMT+08:00 - Beijing, Shanghai, Hong Kong"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT+09:00">
                                            {"GMT+09:00 - Tokyo, Seoul"}
                                        </Select.Item>
                                        <Select.Item value="GMT+10:00">
                                            {"GMT+10:00 - Sydney, Melbourne"}
                                        </Select.Item>
                                        <Select.Item value="GMT+11:00">
                                            {
                                                "GMT+11:00 - Solomon Islands, New Caledonia"
                                            }
                                        </Select.Item>
                                        <Select.Item value="GMT+12:00">
                                            {"GMT+12:00 - Auckland, Wellington"}
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        {errors.timezone && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.timezone.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-time-format`}>
                            {t("timeFormat")}{" "}
                            <Label.Sub>{`(${commonT("optional")})`}</Label.Sub>
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <InfoCircleFilled className="size-5 text-text-disabled-300" />
                                </Tooltip.Trigger>
                                <Tooltip.Content side="top" size="xsmall">
                                    {t("timeFormatTooltip")}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Label.Root>

                        <Controller
                            name="timeFormat"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value || undefined}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger
                                        id={`${uniqueId}-time-format`}
                                    >
                                        <Select.Value
                                            placeholder={t("selectTimeFormat")}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="12-hours">
                                            {t("12Hours")}
                                        </Select.Item>
                                        <Select.Item value="24-hours">
                                            {t("24Hours")}
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        {errors.timeFormat && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.timeFormat.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label.Root htmlFor={`${uniqueId}-date-format`}>
                            {t("dateFormat")}{" "}
                            <Label.Sub>{`(${commonT("optional")})`}</Label.Sub>
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <InfoCircleFilled className="size-5 text-text-disabled-300" />
                                </Tooltip.Trigger>
                                <Tooltip.Content side="top" size="xsmall">
                                    {t("dateFormatTooltip")}
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Label.Root>

                        <Controller
                            name="dateFormat"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value || undefined}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger
                                        id={`${uniqueId}-date-format`}
                                    >
                                        <Select.Value
                                            placeholder={t("selectDateFormat")}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="MM/DD/YY">
                                            {"MM/DD/YY"}
                                        </Select.Item>
                                        <Select.Item value="DD/MM/YY">
                                            {"DD/MM/YY"}
                                        </Select.Item>
                                        <Select.Item value="YY/MM/DD">
                                            {"YY/MM/DD"}
                                        </Select.Item>
                                        <Select.Item value="YYYY-MM-DD">
                                            {"YYYY-MM-DD"}
                                        </Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        {errors.dateFormat && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.dateFormat.message}
                            </p>
                        )}
                    </div>
                </div>

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
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </form>
        </div>
    );
}
