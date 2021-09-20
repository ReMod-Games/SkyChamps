import { Router } from "../deps.ts";
import type { ServerState } from "../types.ts";

const lobbyRouter = new Router<never, ServerState>({ prefix: "/lobby" });

lobbyRouter.get("/", async function (ctx) {
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./resources/html/index.html");
});

lobbyRouter.get("/:id", async function (ctx) {
  // Send lobby page
  ctx.response.body = await ctx.state.cache.get("./resources/html/lobby.html");
});

export { lobbyRouter };
