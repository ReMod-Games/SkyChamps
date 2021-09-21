import { Router } from "../deps.ts";
import { Lobby } from "../utils/lobby.ts";

import type { ServerState } from "../types.ts";

const lobbyRouter = new Router<{ id: string }, ServerState>({
  prefix: "/lobby",
});

lobbyRouter.get("/", async function (ctx) {
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./resources/html/index.html");
});

lobbyRouter.get("/get_code", function (ctx) {
  const code = crypto.randomUUID().substring(0, 8);
  ctx.state.lobbies.set(code, new Lobby(code));
});

lobbyRouter.get("/:id", async function (ctx) {
  if (ctx.state.lobbies.has(ctx.params.id)) {
    // Send lobby page
    ctx.response.body = await ctx.state.cache.get(
      "./resources/html/lobby.html",
    );
  } else {
    // Bad request. Lobby does not exist
    ctx.response.body = "This lobby does not exist";
    ctx.response.status = 400;
  }
});

export { lobbyRouter };
