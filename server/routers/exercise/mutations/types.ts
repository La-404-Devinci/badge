import { z } from "zod";

import { Database } from "@/db";

import {
    batchDeleteExercisesSchema,
    batchUpdateExerciseStatusSchema,
    deleteExerciseSchema,
    submitExerciseSchema,
    updateExerciseSchema,
    updateExerciseStatusSchema,
} from "../validators";

export type UpdateExerciseStatusInput = z.infer<
    typeof updateExerciseStatusSchema
>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type DeleteExerciseInput = z.infer<typeof deleteExerciseSchema>;
export type BatchUpdateExerciseStatusInput = z.infer<
    typeof batchUpdateExerciseStatusSchema
>;
export type BatchDeleteExercisesInput = z.infer<
    typeof batchDeleteExercisesSchema
>;
export type SubmitExerciseInput = z.infer<typeof submitExerciseSchema>;
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
