import { useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function useInvalidateExerciceList() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const invalidateExerciceList = () => {
        queryClient.invalidateQueries({
            queryKey: trpc.exercice.listAdminExercices.queryKey(),
        });

        queryClient.invalidateQueries({
            queryKey: trpc.exercice.listGenerateQueue.queryKey(),
        });
    };

    return invalidateExerciceList;
}
