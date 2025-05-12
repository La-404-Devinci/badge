import type { Database } from "@/db";
import type { Session } from "@/lib/auth/types";

export interface ProjectQueryContext {
    db: Database;
    session: Session;
}

export interface GetProjectsQueryContext extends ProjectQueryContext {
    userId: string;
}
