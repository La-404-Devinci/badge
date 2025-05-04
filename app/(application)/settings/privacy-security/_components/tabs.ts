import { RiDeleteBin2Line, RiDeviceLine } from "@remixicon/react";

import ActiveSessions from "./active-sessions";
import DeleteAccount from "./delete-account";

// Define tab keys for translation rather than using static translations
export const privacySecurityTabs = [
    {
        slug: "active-sessions",
        key: "activeSessions", // Key for translation
        icon: RiDeviceLine,
        component: ActiveSessions,
    },
    {
        slug: "delete-account",
        key: "deleteAccount", // Key for translation
        icon: RiDeleteBin2Line,
        component: DeleteAccount,
    },
] as const;
