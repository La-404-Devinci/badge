"use client";

import { useState } from "react";

import {
    RiMore2Line,
    RiUserFill,
    RiUserForbidFill,
    RiUserForbidLine,
    RiUserSettingsLine,
    RiUserStarFill,
    RiUserStarLine,
    RiUserUnfollowFill,
    RiUserUnfollowLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/custom/confirmation-dialog";
import * as Button from "@/components/ui/button";
import * as Dropdown from "@/components/ui/dropdown";
import { USER_ROLES } from "@/constants/roles";
import { RouterOutput } from "@/trpc/client";

import { useUserTableActions } from "../_hooks/use-user-table-actions";

// Define the user type
type User = RouterOutput["auth"]["listUsers"]["users"][number];

export interface UserActionsProps {
    user: User;
}

export function UserActions({ user }: UserActionsProps) {
    const t = useTranslations("adminUsers");
    const {
        handleImpersonate,
        handleBanUser,
        handleUnbanUser,
        handleChangeRole,
    } = useUserTableActions(user);

    // State for confirmation dialogs
    const [showBanDialog, setShowBanDialog] = useState(false);
    const [showUnbanDialog, setShowUnbanDialog] = useState(false);

    // Handle ban confirmation
    const onConfirmBan = async () => {
        handleBanUser();
        setShowBanDialog(false);
    };

    // Handle unban confirmation
    const onConfirmUnban = async () => {
        handleUnbanUser();
        setShowUnbanDialog(false);
    };

    return (
        <>
            <Dropdown.Root>
                <Dropdown.Trigger asChild>
                    <Button.Root
                        variant="neutral"
                        mode="ghost"
                        size="xsmall"
                        className="ml-auto"
                    >
                        <Button.Icon as={RiMore2Line} />
                    </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align="end" className="w-48">
                    {!user.banned && (
                        <Dropdown.Item onClick={handleImpersonate}>
                            <Dropdown.ItemIcon as={RiUserStarLine} />
                            {t("actions.impersonate")}
                        </Dropdown.Item>
                    )}

                    {/* Role Change Submenu */}
                    {!user.banned && (
                        <Dropdown.MenuSub>
                            <Dropdown.MenuSubTrigger>
                                <Dropdown.ItemIcon as={RiUserSettingsLine} />
                                {t("roles.title")}
                            </Dropdown.MenuSubTrigger>
                            <Dropdown.MenuSubContent>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleChangeRole(USER_ROLES.ADMIN)
                                    }
                                    disabled={user.role === USER_ROLES.ADMIN}
                                >
                                    <Dropdown.ItemIcon as={RiUserStarFill} />
                                    {t("roles.admin")}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() =>
                                        handleChangeRole(USER_ROLES.USER)
                                    }
                                    disabled={user.role === USER_ROLES.USER}
                                >
                                    <Dropdown.ItemIcon as={RiUserFill} />
                                    {t("roles.user")}
                                </Dropdown.Item>
                            </Dropdown.MenuSubContent>
                        </Dropdown.MenuSub>
                    )}

                    {/* Ban/Unban actions */}
                    <Dropdown.Item
                        className="text-error-500"
                        onClick={() =>
                            user.banned
                                ? setShowUnbanDialog(true)
                                : setShowBanDialog(true)
                        }
                    >
                        {user.banned ? (
                            <Dropdown.ItemIcon as={RiUserUnfollowLine} />
                        ) : (
                            <Dropdown.ItemIcon as={RiUserForbidLine} />
                        )}
                        {user.banned
                            ? t("actions.unbanUser")
                            : t("actions.banUser")}
                    </Dropdown.Item>
                </Dropdown.Content>
            </Dropdown.Root>

            {/* Ban Confirmation Dialog */}
            <ConfirmationDialog
                open={showBanDialog}
                onOpenChange={setShowBanDialog}
                title={t("banDialog.title")}
                description={t("banDialog.description", { email: user.email })}
                confirmText={t("banDialog.confirm")}
                cancelText={t("banDialog.cancel")}
                onConfirm={onConfirmBan}
                variant="danger"
                icon={RiUserForbidFill}
            />

            {/* Unban Confirmation Dialog */}
            <ConfirmationDialog
                open={showUnbanDialog}
                onOpenChange={setShowUnbanDialog}
                title={t("unbanDialog.title")}
                description={t("unbanDialog.description", {
                    email: user.email,
                })}
                confirmText={t("unbanDialog.confirm")}
                cancelText={t("unbanDialog.cancel")}
                onConfirm={onConfirmUnban}
                variant="warning"
                icon={RiUserUnfollowFill}
            />
        </>
    );
}
