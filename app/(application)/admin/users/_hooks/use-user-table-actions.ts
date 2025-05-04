import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { impersonateUser } from "@/app/(application)/_lib/impersonate-user";
import { UserRole } from "@/constants/roles";
import { authClient } from "@/lib/auth/client";
import { RouterOutput } from "@/trpc/client";

import { useInvalidateUserList } from "./use-invalidate-user-list";

// Define the user type
type User = RouterOutput["auth"]["listUsers"]["users"][number];

export function useUserTableActions(user: User) {
    const t = useTranslations("adminUsers");
    const router = useRouter();
    const queryClient = useQueryClient();
    const invalidateUsersList = useInvalidateUserList();

    // Action: Impersonate user
    const handleImpersonate = () => {
        impersonateUser(user.id, queryClient, router);
    };

    // Action: Ban user
    const handleBanUser = () => {
        toast.promise(
            authClient.admin.banUser(
                {
                    userId: user.id,
                },
                {
                    onSuccess: () => {
                        invalidateUsersList();
                    },
                    onError: () => {
                        throw new Error("Failed to ban user");
                    },
                }
            ),
            {
                loading: t("toast.banLoading.single"),
                success: t("toast.banSuccess.single"),
                error: t("toast.banError.single"),
            }
        );
    };

    // Action: Unban user
    const handleUnbanUser = () => {
        toast.promise(
            authClient.admin.unbanUser(
                {
                    userId: user.id,
                },
                {
                    onSuccess: () => {
                        invalidateUsersList();
                    },
                    onError: () => {
                        throw new Error("Failed to unban user");
                    },
                }
            ),
            {
                loading: t("toast.unbanLoading.single"),
                success: t("toast.unbanSuccess.single"),
                error: t("toast.unbanError.single"),
            }
        );
    };

    // Action: Change user role
    const handleChangeRole = (role: UserRole) => {
        toast.promise(
            authClient.admin.setRole(
                {
                    userId: user.id,
                    role,
                },
                {
                    onSuccess: () => {
                        invalidateUsersList();
                    },
                    onError: () => {
                        throw new Error("Failed to change user role");
                    },
                }
            ),
            {
                loading: t("toast.changeRoleLoading", { role }),
                success: t("toast.changeRoleSuccess", { role }),
                error: t("toast.changeRoleError"),
            }
        );
    };

    return {
        handleImpersonate,
        handleBanUser,
        handleUnbanUser,
        handleChangeRole,
        invalidateUsersList,
    };
}
