import { z } from "zod";

import { Database } from "@/db";
import { Session } from "@/lib/auth/types";

import {
    toggleNotificationSettingSchema,
    updateNotificationSettingsSchema,
} from "../validators";

export type UpdateNotificationSettingsInput = z.infer<
    typeof updateNotificationSettingsSchema
>;
export type ToggleNotificationSettingInput = z.infer<
    typeof toggleNotificationSettingSchema
>;

export interface NotificationMutationContext<T> {
    input: T;
    db: Database;
    session: Session;
}
