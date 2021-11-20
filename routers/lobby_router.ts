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

lobbyRouter.get("/get_code", async function (ctx) {
  const res = await fetch("http://localhost:8001/get_code");

  ctx.response.status = res.status;
  ctx.response.body = res.body;
});

lobbyRouter.get("/lobby/:id/:name", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send lobby page
  ctx.response.body = await ctx.state.cache.get(
    "frontend/html/game.html",
  );
});

export { lobbyRouter };
