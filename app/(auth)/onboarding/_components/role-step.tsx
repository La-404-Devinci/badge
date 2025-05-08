import { RiUserLine } from "@remixicon/react";
import { useTranslations } from "next-intl";

import { USER_ROLES } from "@/constants/roles";
import { useUserData } from "@/hooks/use-user-data";

import HeaderStep from "./header-step";
import { RoleSelection } from "./role-selection";
import { useStepStore } from "./store";

export default function RoleStep() {
    const t = useTranslations("auth");

    const { user } = useUserData();

    const { nextStep } = useStepStore();

    if (
        user?.role === USER_ROLES.ADMIN ||
        user?.role === USER_ROLES.MEMBER ||
        user?.role === USER_ROLES.EXTERNAL
    ) {
        nextStep();
    }

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
