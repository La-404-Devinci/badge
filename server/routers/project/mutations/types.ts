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
