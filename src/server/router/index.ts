// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { eventsRouter } from "./events";
import { postsRouter } from "./posts";
import { protectedExampleRouter } from "./protected-example-router";
import { usersRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("events.", eventsRouter)
  .merge("posts.", postsRouter)
  .merge("users.", usersRouter)
  .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
