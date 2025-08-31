"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Modal from "@/components/ui/modal";
import * as TextArea from "@/components/ui/textarea";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import { ImageDropzone } from "@/components/custom/image-dropzone";
import { useTRPC } from "@/trpc/client";
import { handleUpload } from "@/lib/minio/client/helpers";

import type { BadgeData } from "./columns";

const updateBadgeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  displayName: z.string().min(1, "Le nom d'affichage est requis"),
  description: z.string().min(1, "La description est requise"),
  color: z.string().min(1, "La couleur est requise"),
  image: z.string().min(1, "L'image est requise"),
  maxLevel: z.coerce.number().min(1, "Le niveau maximum doit être au moins 1"),
  baseExp: z.coerce.number().min(1, "L'expérience de base doit être au moins 1"),
  expMultiplier: z.coerce.number().min(0.1, "Le multiplicateur d'expérience doit être au moins 0.1"),
});

type UpdateBadgeForm = z.infer<typeof updateBadgeSchema>;

interface EditBadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
}

export function EditBadgeModal({ open, onOpenChange, badge }: EditBadgeModalProps) {
  const t = useTranslations("admin.badges");
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: updateBadge } = useMutation(
    trpc.badge.update.mutationOptions({
      onSuccess: () => {
        // Invalider la liste des badges pour rafraîchir les données
        queryClient.invalidateQueries({
          queryKey: trpc.badge.listAdminBadges.queryKey(),
        });
      },
    })
  );

  const { mutateAsync: storeFile } = useMutation(
    trpc.file.storeFile.mutationOptions()
  );

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    try {
      // Créer un canvas pour redimensionner l'image à 128x128
      const image = new Image();
      image.src = URL.createObjectURL(file);

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = 128;
      canvas.height = 128;

      ctx.drawImage(image, 0, 0, 128, 128);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          "image/png",
          0.9
        );
      });

      const resizedFile = new File([blob], file.name, { type: "image/png" });

      // Obtenir les URLs présignées
      const storeFileResult = await storeFile({
        files: [{ originalFileName: resizedFile.name, fileSize: resizedFile.size }],
      });

      // Upload vers S3
      await handleUpload([resizedFile], storeFileResult.publicUrls, () => {
        // Mettre à jour le formulaire avec l'URL de l'image
        setValue("image", storeFileResult.file[0].url);
      });

      // Nettoyer l'URL temporaire
      URL.revokeObjectURL(image.src);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateBadgeForm>({
    resolver: zodResolver(updateBadgeSchema),
  });

  // Mettre à jour le formulaire quand le badge change
  useEffect(() => {
    if (badge) {
      setValue("name", badge.name);
      setValue("displayName", badge.displayName);
      setValue("description", badge.description);
      setValue("color", badge.color);
      setValue("maxLevel", badge.maxLevel);
      setValue("baseExp", badge.baseExp);
      setValue("expMultiplier", badge.expMultiplier);
    }
  }, [badge, setValue]);

  const onSubmit = async (data: UpdateBadgeForm) => {
    if (!badge) return;

    setIsLoading(true);
    try {
      await updateBadge({
        id: badge.id,
        ...data,
      });

      // Fermer le modal et réinitialiser le formulaire
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error updating badge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      reset();
    }
  };

  if (!badge) return null;

  return (
    <Modal.Root open={open} onOpenChange={handleClose}>
      <Modal.Content className="max-w-2xl">
        <Modal.Header
          icon={undefined}
          title={t("edit.title")}
          description={t("edit.description")}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nom */}
              <div className="space-y-2">
                <Label.Root htmlFor="name">
                  {t("edit.form.name")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.name}>
                  <Input.Wrapper>
                    <Input.Input
                      id="name"
                      {...register("name")}
                      placeholder={t("edit.form.namePlaceholder")}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.name && (
                  <p className="text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Nom d'affichage */}
              <div className="space-y-2">
                <Label.Root htmlFor="displayName">
                  {t("edit.form.displayName")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.displayName}>
                  <Input.Wrapper>
                    <Input.Input
                      id="displayName"
                      {...register("displayName")}
                      placeholder={t("edit.form.displayNamePlaceholder")}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.displayName && (
                  <p className="text-sm text-red-600">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              {/* Couleur */}
              <div className="space-y-2">
                <Label.Root htmlFor="color">
                  {t("edit.form.color")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.color}>
                  <Input.Wrapper>
                    <Input.Input
                      id="color"
                      {...register("color")}
                      placeholder={t("edit.form.colorPlaceholder")}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.color && (
                  <p className="text-sm text-red-600">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Niveau maximum */}
              <div className="space-y-2">
                <Label.Root htmlFor="maxLevel">
                  {t("edit.form.maxLevel")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.maxLevel}>
                  <Input.Wrapper>
                    <Input.Input
                      id="maxLevel"
                      type="number"
                      {...register("maxLevel")}
                      placeholder="100"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.maxLevel && (
                  <p className="text-sm text-red-600">
                    {errors.maxLevel.message}
                  </p>
                )}
              </div>

              {/* Expérience de base */}
              <div className="space-y-2">
                <Label.Root htmlFor="baseExp">
                  {t("edit.form.baseExp")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.baseExp}>
                  <Input.Wrapper>
                    <Input.Input
                      id="baseExp"
                      type="number"
                      {...register("baseExp")}
                      placeholder="100"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.baseExp && (
                  <p className="text-sm text-red-600">
                    {errors.baseExp.message}
                  </p>
                )}
              </div>

              {/* Multiplicateur d'expérience */}
              <div className="space-y-2">
                <Label.Root htmlFor="expMultiplier">
                  {t("edit.form.expMultiplier")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.expMultiplier}>
                  <Input.Wrapper>
                    <Input.Input
                      id="expMultiplier"
                      type="number"
                      step="0.1"
                      {...register("expMultiplier")}
                      placeholder="1.0"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.expMultiplier && (
                  <p className="text-sm text-red-600">
                    {errors.expMultiplier.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label.Root htmlFor="description">
                {t("edit.form.description")} <Label.Asterisk />
              </Label.Root>
              <TextArea.Root
                hasError={!!errors.description}
                simple
                id="description"
                {...register("description")}
                placeholder={t("edit.form.descriptionPlaceholder")}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image du badge */}
            <div className="space-y-2">
              <Label.Root htmlFor="image">
                {t("edit.form.image")}
              </Label.Root>
              <ImageDropzone
                onDrop={handleDrop}
                loading={isLoading}
              />
              {errors.image && (
                <p className="text-sm text-red-600">
                  {errors.image.message}
                </p>
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant="neutral"
              mode="stroke"
              disabled={isLoading}
            >
              {t("edit.form.cancel")}
            </Button.Root>
          </Modal.Close>
          <Button.Root
            type="submit"
            variant="primary"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading && <StaggeredFadeLoader variant="muted" />}
            {isLoading ? t("edit.form.updating") : t("edit.form.update")}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
