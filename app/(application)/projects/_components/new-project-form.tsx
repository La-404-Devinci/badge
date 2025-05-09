"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { AvatarUploader } from "@/components/custom/avatar-uploader";
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
    type: z.string().min(1, "projectForm.errors.type"),
    startDate: z.string().min(1, "projectForm.errors.startDate"),
    endDate: z.string().min(1, "projectForm.errors.endDate"),
    exclusive404: z.boolean(),
    title: z.string().min(2, "projectForm.errors.title"),
    description: z.string().min(5, "projectForm.errors.description"),
    badgeName: z.string().min(2, "projectForm.errors.badgeName"),
    badgeImage: z
        .string()
        .url("projectForm.errors.badgeImage")
        .optional()
        .or(
            z.literal(
                "https://www.anthropics.com/portraitpro/img/page-images/homepage/v24/out-now.jpg"
            )
        ),
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
            type: "",
            startDate: "",
            endDate: "",
            exclusive404: false,
            title: "",
            description: "",
            badgeName: "",
            badgeImage:
                "https://www.anthropics.com/portraitpro/img/page-images/homepage/v24/out-now.jpg",
        }),
        []
    );

    const { control, register, handleSubmit, reset, formState } =
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
                    <div>
                        <Label.Root>{t("fields.badgeName")}</Label.Root>
                        <Input.Root hasError={!!formState.errors.badgeName}>
                            <Input.Wrapper>
                                <Input.Input
                                    {...register("badgeName")}
                                    placeholder={t("placeholders.badgeName")}
                                />
                            </Input.Wrapper>
                        </Input.Root>
                        <FormMessage>
                            {formState.errors.badgeName?.message}
                        </FormMessage>
                    </div>
                    <div>
                        <Label.Root>{t("fields.badgeImage")}</Label.Root>
                        <Controller
                            name="badgeImage"
                            control={control}
                            render={({ field }) => (
                                <AvatarUploader
                                    username={
                                        field.value ||
                                        t("placeholders.badgeName")
                                    }
                                    currentAvatar={field.value}
                                    onAvatarChange={(url: string) => {
                                        field.onChange(url);
                                    }}
                                    size="64"
                                />
                            )}
                        />
                        <FormMessage>
                            {formState.errors.badgeImage?.message}
                        </FormMessage>
                    </div>
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
