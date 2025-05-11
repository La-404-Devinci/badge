import { z } from "zod";

import { Database } from "@/db";

import {
    batchDeleteExercicesSchema,
    batchUpdateExerciceStatusSchema,
    deleteExerciceSchema,
    submitExerciceSchema,
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
export type SubmitExerciceInput = z.infer<typeof submitExerciceSchema>;
export interface InputMutationContext<T> {
    input: T;
    db: Database;
}

export type ExecuteCodeOutput =
    | {
          success: true;
          result: string;
          logs: string;
      }
    | {
          success: false;
          error: string;
          logs: string;
      };

export type ValidationErrorResult = {
    success: false;
    call: string;
    output: string;
    expectedOutput: string;
    logs: string;
};

export type ValidationResult =
    | {
          success: true;
      }
    | ValidationErrorResult;
