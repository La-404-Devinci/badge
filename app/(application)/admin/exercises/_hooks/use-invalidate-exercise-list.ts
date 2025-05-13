import { useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function useInvalidateExerciseList() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    const invalidateExerciseList = () => {
        queryClient.invalidateQueries({
            queryKey: trpc.exercise.listAdminExercises.queryKey(),
        });

        queryClient.invalidateQueries({
            queryKey: trpc.exercise.listGenerateQueue.queryKey(),
        });
    };

    return invalidateExerciseList;
}
