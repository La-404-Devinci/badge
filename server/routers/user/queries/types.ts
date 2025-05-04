import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import { exportUserDataSchema } from "../validators";

export type ExportUserDataInput = z.infer<typeof exportUserDataSchema>;

export interface UserQueryContext {
    db: Database;
    session: Session;
}

export interface UserQueryContextWithInput<T> extends UserQueryContext {
    input: T;
}
