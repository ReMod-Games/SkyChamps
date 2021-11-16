import { Router } from "../deps.ts";

import type { HTTPState } from "../types/server_internals.ts";

const lobbyRouter = new Router<{ id: string }, HTTPState>();

// TODO: At some point move this to the real index of the site and not /lobby
lobbyRouter.get("/", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./frontend/html/index.html");
});

lobbyRouter.get("/lobby", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send lobby page
  ctx.response.body = await ctx.state.cache.get(
    "./frontend/html/game.html",
  );
});

export { lobbyRouter };
