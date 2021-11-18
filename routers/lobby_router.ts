import { Router } from "../deps.ts";

import type { HTTPState } from "../types/server_internals.ts";

const lobbyRouter = new Router<HTTPState>();

lobbyRouter.get("/", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./frontend/html/index.html");
});

lobbyRouter.get("/lobby", function(ctx) {
  ctx.state.tracker(ctx);

  ctx.response.body = ctx.state.cache.get(
    "./frontend/html/lobby.html"
  )
});

lobbyRouter.get("/lobby/:id", function (ctx) {
  ctx.state.tracker(ctx);
  // Send lobby page
    ctx.response.body = ctx.state.cache.get(
      "./frontend/html/game.html",
    );

});

export { lobbyRouter };
