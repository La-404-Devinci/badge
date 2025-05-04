import { User } from "better-auth";
import { z } from "zod";

import { Database } from "@/db";

import { listUsersSchema, listWaitlistSchema } from "../validators";

export type ListUsersInput = z.infer<typeof listUsersSchema>;

export type ListWaitlistInput = z.infer<typeof listWaitlistSchema>;

export interface UserQueryContext {
    currentUser: User;
    db: Database;
}

export interface InputQueryContext<T> {
    input: T;
    db: Database;
}
