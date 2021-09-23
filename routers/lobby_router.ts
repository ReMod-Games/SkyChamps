import { Router } from "../deps.ts";
import { Game } from "../utils/game.ts";

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
  const game = new Game(code);
  ctx.state.games.set(code, game);

  // Add listener for abort function
  game.abortController.signal.onabort = () => {
    ctx.state.games.delete(code);
  }

  ctx.response.body = code;
});

lobbyRouter.get("/:id", async function (ctx) {
  if (ctx.state.games.has(ctx.params.id)) {
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
