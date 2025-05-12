import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import { storeFileSchema } from "../validators";

export type StoreFileInput = z.infer<typeof storeFileSchema>;

export interface FileMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}
