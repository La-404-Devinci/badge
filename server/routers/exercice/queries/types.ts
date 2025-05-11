import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import {
    getAdminExerciceSchema,
    listAdminExercicesSchema,
    getChallengeSchema,
    getUserStreakSchema,
} from "../validators";

export type listAdminExercicesInput = z.infer<typeof listAdminExercicesSchema>;
export type getAdminExerciceInput = z.infer<typeof getAdminExerciceSchema>;
export type getChallengeInput = z.infer<typeof getChallengeSchema>;
export type getUserStreakInput = z.infer<typeof getUserStreakSchema>;
export interface InputQueryContext<T> {
    input: T;
    db: Database;
    session: Session;
}
