import type { Database } from "@/db";
import type { ListAdminProjectsInput } from "../validators";

export interface ListAdminProjectsQueryContext<T> {
    db: Database;
    input: T;
}

export type { ListAdminProjectsInput };
