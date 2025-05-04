"use server";

import { cookies } from "next/headers";

export const setLocaleCookie = async (newLocale: string) => {
    const cookieStore = await cookies();
    cookieStore.set("NEXT_LOCALE", newLocale);
};
