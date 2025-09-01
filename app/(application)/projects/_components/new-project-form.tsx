"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { BadgeSelector } from "@/components/custom/badge-selector";
import { ContributorSelector } from "@/components/custom/contributor-selector";
import * as Button from "@/components/ui/button";
import * as Checkbox from "@/components/ui/checkbox";
import * as Divider from "@/components/ui/divider";
import { FormGlobalMessage, FormMessage } from "@/components/ui/form";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import * as Textarea from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

const schema = z.object({
    type: z.enum(["uxui", "dev", "marketing", "other"]),
    startDate: z.string().min(1, "projectForm.errors.startDate"),
    endDate: z.string().min(1, "projectForm.errors.endDate"),
    exclusive404: z.boolean(),
    title: z.string().min(2, "projectForm.errors.title"),
    description: z.string().min(5, "projectForm.errors.description"),
    badgeTypeId: z.string().optional(),
    expReward: z.number().min(1, "projectForm.errors.expReward").optional(),
    contributors: z.array(z.string()).optional(),
});

type ProjectFormValues = z.infer<typeof schema>;

export function NewProjectForm({
    setCloseModal,
}: {
    setCloseModal: (closeModal: boolean) => void;
}) {
    const t = useTranslations("project.create.projectForm");
    const commonT = useTranslations("common");

    const [globalError, setGlobalError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const initialValues = React.useMemo(
        () => ({
            type: "" as "uxui" | "dev" | "marketing" | "other",
            startDate: "",
            endDate: "",
            exclusive404: false,
            title: "",
            description: "",
            badgeTypeId: "",
            expReward: 100,
            contributors: [],
        }),
        []
    );

    const { control, register, handleSubmit, reset, formState, watch } =
        useForm<ProjectFormValues>({
            resolver: zodResolver(schema, {
                errorMap: (error) => ({
                    message: t(error.message || ""),
                }),
            }),
            defaultValues: initialValues,
        });

    const trpc = useTRPC();
    const { mutateAsync: storeProject } = useMutation({
        ...trpc.project.storeProject.mutationOptions(),
    });

    const selectedBadgeTypeId = watch("badgeTypeId");
    const exclusive404 = watch("exclusive404");

    const handleSave = async (values: ProjectFormValues) => {
        setGlobalError(null);
        setIsSubmitting(true);

        try {
            await storeProject(values);
            setMessage(t("success"));
            reset(values);
            setCloseModal(false);
        } catch (error) {
            console.error(error);
            setGlobalError(t("globalError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscard = () => {
        reset(initialValues);
        setGlobalError(null);
        setMessage(null);
        setCloseModal(false);
    };

    const projectTypes = [
        { label: t("types.uxui"), value: "uxui" },
        { label: t("types.dev"), value: "dev" },
        { label: t("types.marketing"), value: "marketing" },
        { label: t("types.other"), value: "other" },
    ];

    return (
        <div className="flex w-full flex-col gap-6">
            <form
                onSubmit={handleSubmit(handleSave)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <Label.Root>{t("fields.title")}</Label.Root>
                        <Input.Root hasError={!!formState.errors.title}>
                            <Input.Wrapper>
                                <Input.Input
                                    {...register("title")}
                                    placeholder={t("placeholders.title")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.title?.message}
                        </FormMessage>
                    </div>
                    <div>
                        <Label.Root>{t("fields.description")}</Label.Root>
                        <Textarea.Root
                            {...register("description")}
                            placeholder={t("placeholders.description")}
                        />
                        <FormMessage>
                            {formState.errors.description?.message}
                        </FormMessage>
                    </div>
                </div>

                <Divider.Root variant="line-spacing" />

                <div className="flex flex-col gap-3">
                    <div>
                        <Label.Root>{t("fields.type")}</Label.Root>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <Select.Trigger>
                                        <Select.Value
                                            placeholder={t("placeholders.type")}
                                        />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {projectTypes.map((option) => (
                                            <Select.Item
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
                        <FormMessage>
                            {formState.errors.type?.message}
                        </FormMessage>
                    </div>
                    <div className="flex items-center gap-2">
                        <Controller
                            name="exclusive404"
                            control={control}
                            render={({ field }) => (
                                <Checkbox.Root
                                    id="exclusive404"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label.Root
                            className="text-paragraph-sm"
                            htmlFor="exclusive404"
                        >
                            {t("fields.exclusive404")}
                        </Label.Root>
                    </div>
                </div>

                <Divider.Root variant="line-spacing" />

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label.Root>{t("fields.startDate")}</Label.Root>
                        <Input.Root hasError={!!formState.errors.startDate}>
                            <Input.Wrapper>
                                <Input.Input
                                    type="date"
                                    {...register("startDate")}
                                    placeholder={t("placeholders.startDate")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.startDate?.message}
                        </FormMessage>
                    </div>
                    <div className="flex-1">
                        <Label.Root>{t("fields.endDate")}</Label.Root>
                        <Input.Root hasError={!!formState.errors.endDate}>
                            <Input.Wrapper>
                                <Input.Input
                                    type="date"
                                    {...register("endDate")}
                                    placeholder={t("placeholders.endDate")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.endDate?.message}
                        </FormMessage>
                    </div>
                </div>

                <Divider.Root variant="line-spacing" />

                <div className="flex flex-col gap-3">
                    <Controller
                        name="badgeTypeId"
                        control={control}
                        render={({ field }) => (
                            <BadgeSelector
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder={t("placeholders.badge")}
                                hasError={!!formState.errors.badgeTypeId}
                            />
                        )}
                    />
                    <FormMessage>
                        {formState.errors.badgeTypeId?.message}
                    </FormMessage>

                    {selectedBadgeTypeId && (
                        <div>
                            <Label.Root>{t("fields.expReward")}</Label.Root>
                            <Input.Root hasError={!!formState.errors.expReward}>
                                <Input.Wrapper>
                                    <Input.Input
                                        type="number"
                                        min="1"
                                        {...register("expReward", { valueAsNumber: true })}
                                        placeholder={t("placeholders.expReward")}
                                    />
                                </Input.Wrapper>
                            </Input.Root>
                            <FormMessage>
                                {formState.errors.expReward?.message}
                            </FormMessage>
                        </div>
                    )}
                </div>

                <Divider.Root variant="line-spacing" />

                <div className="flex flex-col gap-3">
                    <Controller
                        name="contributors"
                        control={control}
                        render={({ field }) => (
                            <ContributorSelector
                                value={field.value || []}
                                onValueChange={field.onChange}
                                placeholder={t("placeholders.contributors")}
                                disabled={exclusive404}
                            />
                        )}
                    />
                    <FormMessage>
                        {formState.errors.contributors?.message}
                    </FormMessage>
                </div>

                <FormGlobalMessage variant="error">
                    {globalError}
                </FormGlobalMessage>
                {message && !globalError && (
                    <FormGlobalMessage variant="success">
                        {message}
                    </FormGlobalMessage>
                )}

                <div className="mt-1 grid grid-cols-2 gap-3">
                    <Button.Root
                        variant="neutral"
                        mode="stroke"
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleDiscard}
                    >
                        {commonT("discard")}
                    </Button.Root>
                    <Button.Root type="submit" disabled={isSubmitting}>
                        {t("actions.create")}
                    </Button.Root>
                </div>
            </form>
        </div>
    );
}
