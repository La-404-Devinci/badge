"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Modal from "@/components/ui/modal";
import * as Select from "@/components/ui/select";
import * as TextArea from "@/components/ui/textarea";
import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import { ImageDropzone } from "@/components/custom/image-dropzone";
import { useTRPC } from "@/trpc/client";
import { handleUpload } from "@/lib/minio/client/helpers";

const createBadgeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  displayName: z.string().min(1, "Le nom d'affichage est requis"),
  description: z.string().min(1, "La description est requise"),
  color: z.string().min(1, "La couleur est requise"),
  image: z.string().min(1, "L'image est requise"),
  maxLevel: z.coerce.number().min(1, "Le niveau maximum doit être au moins 1"),
  baseExp: z.coerce.number().min(1, "L'expérience de base doit être au moins 1"),
  expMultiplier: z.coerce.number().min(0.1, "Le multiplicateur d'expérience doit être au moins 0.1"),
});

type CreateBadgeForm = z.infer<typeof createBadgeSchema>;

interface CreateBadgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBadgeModal({ open, onOpenChange }: CreateBadgeModalProps) {
  const t = useTranslations("admin.badges");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createBadge } = useMutation(
    trpc.badge.create.mutationOptions({
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
    setIsUploadingImage(true);

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

      // Dessiner l'image redimensionnée en conservant les proportions
      const scale = Math.min(128 / image.width, 128 / image.height);
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      const x = (128 - scaledWidth) / 2;
      const y = (128 - scaledHeight) / 2;

      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

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
        // Cette fonction est appelée après l'upload S3
      });

      // Mettre à jour le formulaire avec l'URL de l'image APRÈS l'upload
      console.log("Image uploadée, URL:", storeFileResult.file[0].url);
      setValue("image", storeFileResult.file[0].url);

      // Nettoyer l'URL temporaire
      URL.revokeObjectURL(image.src);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateBadgeForm>({
    resolver: zodResolver(createBadgeSchema),
    defaultValues: {
      maxLevel: 100,
      baseExp: 100,
      expMultiplier: 1,
    },
  });



  const onSubmit = async (data: CreateBadgeForm) => {
    setIsLoading(true);
    try {
      await createBadge(data);

      // Fermer le modal et réinitialiser le formulaire
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Error creating badge:", error);
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

  return (
    <Modal.Root open={open} onOpenChange={handleClose}>
      <Modal.Content className="max-w-2xl">
        <Modal.Header
          icon={undefined}
          title={t("create.title")}
          description={t("create.description")}
        />

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Nom */}
              <div className="space-y-2">
                <Label.Root htmlFor="name">
                  {t("create.form.name")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.name}>
                  <Input.Wrapper>
                    <Input.Input
                      id="name"
                      {...register("name")}
                      placeholder={t("create.form.namePlaceholder")}
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
                  {t("create.form.displayName")} <Label.Asterisk />
                </Label.Root>
                <Input.Root hasError={!!errors.displayName}>
                  <Input.Wrapper>
                    <Input.Input
                      id="displayName"
                      {...register("displayName")}
                      placeholder={t("create.form.displayNamePlaceholder")}
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
                  {t("create.form.color")} <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  onValueChange={(value) => {
                    setValue("color", value);
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder={t("create.form.colorPlaceholder")} />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="blue">{t("create.colors.blue")}</Select.Item>
                    <Select.Item value="green">{t("create.colors.green")}</Select.Item>
                    <Select.Item value="purple">{t("create.colors.purple")}</Select.Item>
                    <Select.Item value="orange">{t("create.colors.orange")}</Select.Item>
                    <Select.Item value="red">{t("create.colors.red")}</Select.Item>
                    <Select.Item value="yellow">{t("create.colors.yellow")}</Select.Item>
                    <Select.Item value="pink">{t("create.colors.pink")}</Select.Item>
                    <Select.Item value="teal">{t("create.colors.teal")}</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.color && (
                  <p className="text-sm text-red-600">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Niveau maximum */}
              <div className="space-y-2">
                <Label.Root htmlFor="maxLevel">
                  {t("create.form.maxLevel")} <Label.Asterisk />
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
                  {t("create.form.baseExp")} <Label.Asterisk />
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
                  {t("create.form.expMultiplier")} <Label.Asterisk />
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
                {t("create.form.description")} <Label.Asterisk />
              </Label.Root>
              <TextArea.Root
                hasError={!!errors.description}
                simple
                id="description"
                {...register("description")}
                placeholder={t("create.form.descriptionPlaceholder")}
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
                {t("create.form.image")} <Label.Asterisk />
              </Label.Root>

              {/* Afficher l'image sélectionnée */}
              {watch("image") && (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-bg-weak-50">
                  <img
                    src={watch("image")}
                    alt="Image du badge"
                    className="size-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-base">Image sélectionnée</p>
                    <p className="text-xs text-text-sub-600">Taille: 128x128px</p>
                  </div>
                  <Button.Root
                    type="button"
                    variant="neutral"
                    mode="stroke"
                    size="xsmall"
                    onClick={() => setValue("image", "")}
                  >
                    Supprimer
                  </Button.Root>
                </div>
              )}

              {/* Indicateur de chargement pendant l'upload */}
              {isUploadingImage && (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-bg-weak-50">
                  <div className="size-16 rounded bg-bg-weak-100 flex items-center justify-center">
                    <StaggeredFadeLoader variant="muted" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-base">Upload en cours...</p>
                    <p className="text-xs text-text-sub-600">Redimensionnement et upload de l'image</p>
                  </div>
                </div>
              )}

              <ImageDropzone
                onDrop={handleDrop}
                loading={isUploadingImage}
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
              {t("create.form.cancel")}
            </Button.Root>
          </Modal.Close>
          <Button.Root
            type="submit"
            variant="primary"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading && <StaggeredFadeLoader variant="muted" />}
            {isLoading ? t("create.form.creating") : t("create.form.create")}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
