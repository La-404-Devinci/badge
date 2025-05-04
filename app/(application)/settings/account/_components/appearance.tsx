"use client";

import * as LabelPrimitives from "@radix-ui/react-label";
import { RiEqualizerLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import * as Divider from "@/components/ui/divider";
import * as Radio from "@/components/ui/radio";

export default function Appearance() {
    const { theme, setTheme } = useTheme();
    const t = useTranslations("settings.appearanceSettings");

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <div className="text-label-md">{t("title")}</div>
                <p className="mt-1 text-paragraph-sm text-text-sub-600">
                    {t("description")}
                </p>
            </div>

            <Divider.Root variant="line-spacing" />

            <Radio.Group
                className="flex flex-col gap-3"
                value={theme}
                onValueChange={setTheme}
            >
                <LabelPrimitives.Root className="flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent has-[[data-state=checked]]:shadow-none has-[[data-state=checked]]:ring-primary-base">
                    <div className="flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiSunLine className="size-5 text-text-sub-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-label-sm">{t("lightMode")}</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                            {t("lightModeDescription")}
                        </div>
                    </div>
                    <Radio.Item id="light" value="light" />
                </LabelPrimitives.Root>

                <LabelPrimitives.Root className="flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent has-[[data-state=checked]]:shadow-none has-[[data-state=checked]]:ring-primary-base">
                    <div className="flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiMoonLine className="size-5 text-text-sub-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-label-sm">{t("darkMode")}</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                            {t("darkModeDescription")}
                        </div>
                    </div>
                    <Radio.Item id="dark" value="dark" />
                </LabelPrimitives.Root>

                <LabelPrimitives.Root className="flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent has-[[data-state=checked]]:shadow-none has-[[data-state=checked]]:ring-primary-base">
                    <div className="flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                        <RiEqualizerLine className="size-5 text-text-sub-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="text-label-sm">{t("systemMode")}</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                            {t("systemModeDescription")}
                        </div>
                    </div>
                    <Radio.Item id="system" value="system" />
                </LabelPrimitives.Root>
            </Radio.Group>
        </div>
    );
}
