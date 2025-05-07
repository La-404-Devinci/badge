import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

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
    ],
});
