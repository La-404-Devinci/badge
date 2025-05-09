import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import { createProjectSchema } from "../validators";

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export interface ProjectMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}
