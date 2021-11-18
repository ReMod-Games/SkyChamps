import { Router } from "../deps.ts";

import type { HTTPState } from "../types/server_internals.ts";

const lobbyRouter = new Router<HTTPState>();

lobbyRouter.get("/", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./frontend/html/index.html");
});

lobbyRouter.get("/lobby", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    "frontend/html/lobby.html",
  );
});

lobbyRouter.get("/lobby/:id", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send lobby page
  ctx.response.body = await ctx.state.cache.get(
    "frontend/html/game.html",
  );
});

export { lobbyRouter };
