"use client";

import { useState } from "react";

import { RiCloseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import Cropper from "react-easy-crop";

import * as Button from "@/components/ui/button";
import * as Label from "@/components/ui/label";
import * as Slider from "@/components/ui/slider";
import * as Tooltip from "@/components/ui/tooltip";

import type { Area, Point } from "react-easy-crop";

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedAreaPixels: Area) => void;
    onRemove: () => void;
}

export function ImageCropper({
    image,
    onCropComplete,
    onRemove,
}: ImageCropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const t = useTranslations("imageCropper");

    return (
        <div className="mt-4 relative">
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: 300,
                    overflow: "hidden",
                    borderRadius: "15px",
                }}
            >
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) =>
                        onCropComplete(croppedAreaPixels)
                    }
                    cropShape="round"
                    showGrid={false}
                    classes={{
                        containerClassName:
                            "rounded-lg bg-bg-surface-800 dark:bg-neutral-900",
                        mediaClassName: "rounded-lg",
                        cropAreaClassName:
                            "rounded-lg border-2 border-primary-base",
                    }}
                    style={{
                        containerStyle: {
                            boxShadow: "0 2px 4px #1b1c1d0a",
                        },
                        mediaStyle: {
                            opacity: 0.9,
                        },
                    }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 px-2">
                <div className="flex-1 space-y-1">
                    <Label.Root className="text-label-sm text-text-soft-400">
                        {t("zoomLabel")}
                    </Label.Root>
                    <Slider.Root
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(value) => setZoom(value[0])}
                        aria-label={t("zoomAriaLabel")}
                    >
                        <Slider.Thumb />
                    </Slider.Root>
                </div>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <Button.Root
                            variant="error"
                            mode="stroke"
                            size="xsmall"
                            onClick={onRemove}
                            className="mt-6"
                        >
                            <Button.Icon as={RiCloseLine} />
                            <span>{t("removeButton")}</span>
                        </Button.Root>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p className="text-paragraph-xs">
                            {t("removeTooltip")}
                        </p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
        </div>
    );
}
