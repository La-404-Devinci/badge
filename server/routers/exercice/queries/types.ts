import { z } from "zod";

import { Database } from "@/db";

import { listExercicesSchema } from "../validators";

export type ListExercicesInput = z.infer<typeof listExercicesSchema>;

export interface InputQueryContext<T> {
    input: T;
    db: Database;
}
