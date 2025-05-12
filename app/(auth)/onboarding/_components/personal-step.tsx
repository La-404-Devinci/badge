import { RiUserLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import HeaderStep from "./header-step";
import { PersonalForm } from "./personal-form";

export default function PersonalStep() {
    const t = useTranslations("auth");
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title={t("onboarding.personal.title")}
                description={t("onboarding.personal.description")}
                icon={<RiUserLine />}
            />
            <PersonalForm />
        </div>
    );
}
