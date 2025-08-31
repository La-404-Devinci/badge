import { createContext } from "@/server/context";
import { createCallerFactory, router } from "@/server/trpc";

import { authRouter } from "./auth/router";
import { badgeRouter } from "./badge/router";
import { exerciseRouter } from "./exercise/router";
import { fileRouter } from "./file/router";
import { notificationRouter } from "./notification/router";
import { projectRouter } from "./project/router";
import { userRouter } from "./user/router";

export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    notification: notificationRouter,
    exercise: exerciseRouter,
    project: projectRouter,
    file: fileRouter,
    badge: badgeRouter,
});

export const createCaller = createCallerFactory(appRouter)(createContext);

export type AppRouter = typeof appRouter;
