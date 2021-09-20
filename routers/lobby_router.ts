import { Router } from "../deps.ts";
import { ServerState } from "../types.ts";
/**
 * Game stuff
 */

const lobbyRouter = new Router<never, ServerState>({ prefix: "/lobby" });

lobbyRouter.get("/", function (ctx) {
  // Send normal page
  // Join and create button
  ctx.response.body = ctx.state.cache.get("./client/index.html");
});
lobbyRouter.get("/:id", function (ctx) {
  ctx.response.body = "ree ID";
  // Show waiting list
  // CLIENT: Start socket connection to /game/:id
});

export { lobbyRouter };
