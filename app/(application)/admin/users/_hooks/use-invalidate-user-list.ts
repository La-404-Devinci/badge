import { useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function useInvalidateUserList() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const invalidateUsersList = () => {
        queryClient.invalidateQueries({
            queryKey: trpc.auth.listUsers.queryKey(),
        });
    };

    return invalidateUsersList;
}
