import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import { storeContributorSchema, storeProjectSchema } from "../validators";

export type StoreProjectInput = z.infer<typeof storeProjectSchema>;
export type StoreContributorInput = z.infer<typeof storeContributorSchema>;

export interface ProjectMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}
