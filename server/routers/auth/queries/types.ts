import { User } from "better-auth";
import { z } from "zod";

import { Database } from "@/db";

import { listUsersSchema } from "../validators";

export type ListUsersInput = z.infer<typeof listUsersSchema>;

export interface UserQueryContext {
    currentUser: User;
    db: Database;
}

export interface InputQueryContext<T> {
    input: T;
    db: Database;
}
