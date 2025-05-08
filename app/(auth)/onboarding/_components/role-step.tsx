import { RiUserLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import HeaderStep from "./header-step";
import { RoleSelection } from "./role-selection";
export default function RoleStep() {
    const t = useTranslations("auth");
    return (
        <div className="flex flex-col gap-6">
            <HeaderStep
                title={t("onboarding.roleSelection.title")}
                description={t("onboarding.roleSelection.description")}
                icon={<RiUserLine />}
            />
            <RoleSelection />
        </div>
    );
}
