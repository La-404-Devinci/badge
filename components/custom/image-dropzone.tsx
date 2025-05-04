"use client";

import { RiUploadCloud2Line } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";

import * as FileUpload from "@/components/ui/file-upload";
import { cn } from "@/lib/utils/cn";

interface ImageDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    loading?: boolean;
}

export function ImageDropzone({ onDrop, loading }: ImageDropzoneProps) {
    const t = useTranslations("components.imageDropzone");

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: { "image/png": [], "image/jpeg": [], "image/jpg": [] },
        multiple: false,
        noClick: true,
    });

    return (
        <div className="w-full">
            <FileUpload.Root
                {...getRootProps()}
                className={cn(
                    isDragActive &&
                        "border-information-base bg-information-lighter",
                    isDragAccept && "border-success-base bg-success-lighter",
                    isDragReject && "border-error-base bg-error-lighter",
                    loading && "animate-pulse opacity-50"
                )}
            >
                <input {...getInputProps()} disabled={loading} />
                <FileUpload.Icon
                    as={RiUploadCloud2Line}
                    className={cn(
                        "transition-colors duration-150",
                        isDragAccept
                            ? "text-success-dark"
                            : "text-text-sub-600",
                        isDragReject && "text-error-dark"
                    )}
                />

                <div className="space-y-1.5">
                    <div className="text-label-sm text-text-strong-950">
                        {loading ? t("uploading") : t("dropImagePrompt")}
                    </div>
                    <div
                        className={cn(
                            "text-paragraph-xs text-text-sub-600",
                            loading && "opacity-0"
                        )}
                    >
                        {t("acceptedFormats")}
                    </div>
                </div>
            </FileUpload.Root>
        </div>
    );
}
