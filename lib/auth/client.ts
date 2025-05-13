import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "@/auth";

import { ac, admin, member, external, unknown } from "./permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                admin,
                member,
                external,
                unknown,
            },
        }),
        inferAdditionalFields<typeof auth>(),
    ],
});
