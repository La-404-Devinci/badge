import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { useInvalidateUserList } from "./use-invalidate-user-list";

export function useBatchUserActions() {
    const t = useTranslations("adminUsers");
    const trpc = useTRPC();
    const invalidateUsersList = useInvalidateUserList();

    const { mutateAsync: banMutipleUsersMutation } = useMutation(
        trpc.auth.banMultipleUsers.mutationOptions()
    );

    const handleBanMultipleUsers = async (userIds: string[]) => {
        if (!userIds.length) return;

        toast.promise(
            banMutipleUsersMutation(
                {
                    userIds,
                },
                {
                    onSuccess: () => {
                        invalidateUsersList();
                    },
                }
            ),
            {
                loading:
                    userIds.length === 1
                        ? t("toast.banLoading.single")
                        : t("toast.banLoading.multiple", {
                              count: userIds.length,
                          }),
                success:
                    userIds.length === 1
                        ? t("toast.banSuccess.single")
                        : t("toast.banSuccess.multiple", {
                              count: userIds.length,
                          }),
                error:
                    userIds.length === 1
                        ? t("toast.banError.single")
                        : t("toast.banError.multiple", {
                              count: userIds.length,
                          }),
            }
        );
    };

    return {
        banMultipleUsers: handleBanMultipleUsers,
    };
}
