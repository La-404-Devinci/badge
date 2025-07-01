import { useQueryClient } from "@tanstack/react-query";

export function useRevalidate() {
    const queryClient = useQueryClient();

    const revalidateQueries = (queryKey: string[]) => {
        queryClient.invalidateQueries({
            queryKey: [queryKey],
        });
    };

    return {
        revalidateQueries,
    };
}
