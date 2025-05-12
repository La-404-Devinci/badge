"use client";

import { useTranslations } from "next-intl";

import * as Avatar from "@/components/ui/avatar";
import { PROJECT } from "@/constants/project";
import { useUserData } from "@/hooks/use-user-data";

import { CreatePostButton } from "../../_components/create-post-button";
import { CreateProjectButton } from "../../_components/create-project-button";
import Header from "../../_components/header";

export default function DashboardHeader() {
    const { user } = useUserData();
    const t = useTranslations("dashboard.header");

    return (
        <Header
            icon={
                <Avatar.Root size="48" color="yellow">
                    {user?.image && <Avatar.Image src={user?.image} alt="" />}
                </Avatar.Root>
            }
            title={user?.name}
            description={t("welcomeBack", { projectName: PROJECT.NAME })}
            contentClassName="hidden lg:flex"
        >
            <CreatePostButton className="hidden lg:flex" />
            <CreateProjectButton className="hidden lg:flex" />
        </Header>
    );
}
