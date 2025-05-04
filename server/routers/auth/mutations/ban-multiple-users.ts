import { headers } from "next/headers";

import { auth } from "@/auth";

import { AuthMutationContext, BanMultipleUsersInput } from "./types";

export const banMultipleUsers = async ({
    input,
}: AuthMutationContext<BanMultipleUsersInput>) => {
    const { userIds } = input;

    for (const userId of userIds) {
        await auth.api.banUser({
            headers: await headers(),
            body: {
                userId,
            },
        });
    }

    return {
        success: true,
    };
};
