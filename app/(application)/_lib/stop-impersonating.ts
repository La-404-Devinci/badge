import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";

import type { QueryClient } from "@tanstack/react-query";
import type { useRouter } from "next/navigation";

export async function stopImpersonating(
    queryClient: QueryClient,
    router: ReturnType<typeof useRouter>
) {
    await authClient.admin.stopImpersonating();
    queryClient.invalidateQueries({
        queryKey: [["user"]],
    });
    router.push(PAGES.ADMIN_USERS);
    router.refresh();
}
