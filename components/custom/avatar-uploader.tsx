"use client";

import { useCallback, useEffect, useState } from "react";

import { RiUser6Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ulid } from "ulid";

import { ImageCropper } from "@/components/custom/image-cropper";
import { ImageDropzone } from "@/components/custom/image-dropzone";
import * as Avatar from "@/components/ui/avatar";
import * as Button from "@/components/ui/button";
import * as Modal from "@/components/ui/modal";
import { handleUpload } from "@/lib/minio/client";
import { cn } from "@/lib/utils/cn";
import { useTRPC } from "@/trpc/client";

import { StaggeredFadeLoader } from "../staggered-fade-loader";

import type { Area } from "react-easy-crop";

// Define valid avatar sizes based on the component implementation
type AvatarSize = "20" | "24" | "32" | "40" | "48" | "56" | "64" | "72" | "80";

interface AvatarUploaderProps {
    username?: string;
    currentAvatar?: string | null;
    onAvatarChange: (avatarUrl: string) => void;
    size?: AvatarSize;
    className?: string;
}

export function AvatarUploader({
    username,
    currentAvatar,
    onAvatarChange,
    size = "64",
    className,
}: AvatarUploaderProps) {
    const commonT = useTranslations("common");
    const avatarT = useTranslations("components.avatar");

    // State for image upload modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );
    const [isUploading, setIsUploading] = useState(false);
    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
    const [previousAvatar, setPreviousAvatar] = useState<
        string | null | undefined
    >(null);

    const trpc = useTRPC();
    const { mutateAsync: storeFile } = useMutation(
        trpc.file.storeFile.mutationOptions()
    );

    useEffect(() => {
        if (previousAvatar !== currentAvatar) {
            setIsAvatarUpdating(false);
        }
        setPreviousAvatar(currentAvatar);
    }, [currentAvatar, previousAvatar]);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    }, []);

    const handleCropComplete = useCallback((croppedArea: Area) => {
        setCroppedAreaPixels(croppedArea);
    }, []);

    const handleRemoveImage = useCallback(() => {
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
        }
        setSelectedImage(null);
        setCroppedAreaPixels(null);
    }, [selectedImage]);

    const handleCropAndUpload = async () => {
        if (!selectedImage || !croppedAreaPixels) return;

        setIsUploading(true);

        try {
            const image = new Image();
            image.src = selectedImage;
            await new Promise((resolve) => {
                image.onload = resolve;
            });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const TARGET_SIZE = 400;

            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                TARGET_SIZE,
                TARGET_SIZE
            );

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                    },
                    "image/png",
                    0.85
                );
            });

            const filename = `user-avatar/${ulid()}.png`;
            const file = new File([blob], filename, { type: "image/png" });

            const storeFileDb = await storeFile({
                files: [{ originalFileName: filename, fileSize: file.size }],
            });

            await handleUpload([file], storeFileDb.publicUrls, () => {
                setIsAvatarUpdating(true);
                onAvatarChange(storeFileDb.file[0].url);
            });

            setIsModalOpen(false);
            if (selectedImage) {
                URL.revokeObjectURL(selectedImage);
            }
            setSelectedImage(null);
            setCroppedAreaPixels(null);
        } catch (error) {
            console.error("Error uploading image:", error);
            setIsAvatarUpdating(false);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cn("flex gap-5", className)}>
            <Avatar.Root size={size}>
                {currentAvatar && <Avatar.Image src={currentAvatar} alt="" />}
            </Avatar.Root>
            <div className="space-y-3">
                <div className="space-y-1">
                    <div className="text-label-md text-text-strong-950">
                        {username}
                    </div>
                    <div className="text-paragraph-sm text-text-sub-600">
                        {avatarT("dimensions")}
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button.Root
                        variant="neutral"
                        mode="stroke"
                        size="xsmall"
                        onClick={() => setIsModalOpen(true)}
                        disabled={isAvatarUpdating}
                    >
                        {isAvatarUpdating ? (
                            <>
                                <StaggeredFadeLoader
                                    variant="muted"
                                    className="flex size-5 shrink-0 items-center justify-center"
                                />
                                {commonT("saving")}
                            </>
                        ) : currentAvatar ? (
                            commonT("change")
                        ) : (
                            commonT("upload")
                        )}
                    </Button.Root>

                    {/* Image Upload Modal */}
                    <Modal.Root
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                    >
                        <Modal.Content className="max-w-md">
                            <Modal.Header
                                icon={RiUser6Line}
                                title={avatarT("title.new")}
                                description={avatarT("recommendedSize")}
                            />
                            <Modal.Body>
                                {!selectedImage ? (
                                    <ImageDropzone
                                        onDrop={handleDrop}
                                        loading={isUploading}
                                    />
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <ImageCropper
                                            image={selectedImage}
                                            onCropComplete={handleCropComplete}
                                            onRemove={handleRemoveImage}
                                        />
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Modal.Close asChild>
                                    <Button.Root
                                        variant="neutral"
                                        mode="stroke"
                                        size="small"
                                        className="w-full"
                                        disabled={isUploading}
                                    >
                                        {commonT("cancel")}
                                    </Button.Root>
                                </Modal.Close>
                                <Button.Root
                                    variant="primary"
                                    onClick={handleCropAndUpload}
                                    disabled={!croppedAreaPixels || isUploading}
                                    size="small"
                                    className="w-full"
                                >
                                    {isUploading ? (
                                        <>
                                            <StaggeredFadeLoader
                                                variant="muted"
                                                className="flex size-5 shrink-0 items-center justify-center"
                                            />
                                            {commonT("uploading")}
                                        </>
                                    ) : (
                                        commonT("upload")
                                    )}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </div>
            </div>
        </div>
    );
}
