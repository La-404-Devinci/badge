import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import {
    getAdminExerciseSchema,
    listAdminExercisesSchema,
    getChallengeSchema,
    getUserStreakSchema,
} from "../validators";

export type listAdminExercisesInput = z.infer<typeof listAdminExercisesSchema>;
export type getAdminExerciseInput = z.infer<typeof getAdminExerciseSchema>;
export type getChallengeInput = z.infer<typeof getChallengeSchema>;
export type getUserStreakInput = z.infer<typeof getUserStreakSchema>;
export interface InputQueryContext<T> {
    input: T;
    db: Database;
    session: Session;
}
