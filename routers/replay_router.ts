import { Router } from "../deps.ts";

import type { HTTPState } from "../types/server_internals.ts";

const replayRouter = new Router<HTTPState>({ prefix: "/replay" });

replayRouter.get("/view/:id", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.state.database.get(ctx.params.id);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./frontend/html/index.html");
});

replayRouter.get("/", function (ctx) {
  ctx.response.body = ctx.state.cache.get("./frontend/html/replay.html");
});

export { replayRouter };
