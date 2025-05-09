import { z } from "zod";

import { Database } from "@/db";

import {
    batchDeleteExercicesSchema,
    batchUpdateExerciceStatusSchema,
    deleteExerciceSchema,
    updateExerciceSchema,
    updateExerciceStatusSchema,
} from "../validators";

export type UpdateExerciceStatusInput = z.infer<
    typeof updateExerciceStatusSchema
>;
export type UpdateExerciceInput = z.infer<typeof updateExerciceSchema>;
export type DeleteExerciceInput = z.infer<typeof deleteExerciceSchema>;
export type BatchUpdateExerciceStatusInput = z.infer<
    typeof batchUpdateExerciceStatusSchema
>;
export type BatchDeleteExercicesInput = z.infer<
    typeof batchDeleteExercicesSchema
>;

export interface InputMutationContext<T> {
    input: T;
    db: Database;
}

export type ExecuteCodeOutput =
    | {
          success: true;
          result: string;
      }
    | {
          success: false;
          error: string;
      };
