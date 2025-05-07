import { z } from "zod";

import { Database } from "@/db";

import {
    getAdminExerciceSchema,
    listAdminExercicesSchema,
} from "../validators";

export type listAdminExercicesInput = z.infer<typeof listAdminExercicesSchema>;
export type getAdminExerciceInput = z.infer<typeof getAdminExerciceSchema>;

export interface InputQueryContext<T> {
    input: T;
    db: Database;
}
