import { RiBriefcaseLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import HeaderStep from "./header-step";
import { PositionForm } from "./position-form";

export default function PositionStep() {
    const t = useTranslations("auth");
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title={t("onboarding.position.title")}
                description={t("onboarding.position.description")}
                icon={<RiBriefcaseLine />}
            />
            <PositionForm />
        </div>
    );
}
