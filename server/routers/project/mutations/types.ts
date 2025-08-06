import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import { storeProjectSchema } from "../validators";

export type StoreProjectInput = z.infer<typeof storeProjectSchema>;

export interface ProjectMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}

// Accept project types
export const acceptProjectSchema = z.object({
    projectId: z.string(),
});

export type AcceptProjectInput = z.infer<typeof acceptProjectSchema>;
export type AcceptProjectMutationContext<T> = ProjectMutationContext<T>;

// Reject project types
export const rejectProjectSchema = z.object({
    projectId: z.string(),
});

export type RejectProjectInput = z.infer<typeof rejectProjectSchema>;
export type RejectProjectMutationContext<T> = ProjectMutationContext<T>;

// Delete project types
export const deleteProjectSchema = z.object({
    projectId: z.string(),
});

export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
export type DeleteProjectMutationContext<T> = ProjectMutationContext<T>;
