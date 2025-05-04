import { createContext } from "@/server/context";
import { createCallerFactory, router } from "@/server/trpc";

import { authRouter } from "./auth/router";
import { notificationRouter } from "./notification/router";
import { userRouter } from "./user/router";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    notification: notificationRouter,
});

export const createCaller = createCallerFactory(appRouter)(createContext);

export type AppRouter = typeof appRouter;
