// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { eventsRouter } from "./events";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("events.", eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
