import "server-only"; // <-- ensure this file cannot be imported from the client

import { cache } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
    createTRPCOptionsProxy,
    TRPCQueryOptions,
} from "@trpc/tanstack-react-query";

import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";

import { makeQueryClient } from "./query-client";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
    ctx: createContext,
    router: appRouter,
    queryClient: getQueryClient,
});

export const api = appRouter.createCaller(createContext);

export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {props.children}
        </HydrationBoundary>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === "infinite") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
