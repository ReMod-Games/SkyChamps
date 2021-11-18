import { Router } from "../deps.ts";

import type { HTTPState } from "../types/server_internals.ts";

const lobbyRouter = new Router<HTTPState>();

// TODO: At some point move this to the real index of the site and not /lobby
lobbyRouter.get("/", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./frontend/html/index.html");
});

lobbyRouter.get("/lobby/:id", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send lobby page
  const verification = await ctx.state.intercomm.verifyCode(ctx.params.id);

  if (ctx.params.id && verification) {
    ctx.response.body = ctx.state.cache.get(
      "./frontend/html/game.html",
    );
  }
  
});

lobbyRouter.get("/get_code", async function(ctx) {
    const code = await ctx.state.intercomm.requestLobby();
    ctx.response.body = code;
    ctx.response.type = "text/plain";
})

export { lobbyRouter };
