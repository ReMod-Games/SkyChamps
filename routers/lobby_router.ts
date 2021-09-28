import { Router } from "../deps.ts";
import { Game } from "../utils/match/game.ts";

import type { ServerState } from "../types.ts";

const lobbyRouter = new Router<{ id: string }, ServerState>({
  prefix: "/lobby",
});

// At some point move this to the real index of the site and not /lobby
lobbyRouter.get("/", async function (ctx) {
  ctx.state.tracker(ctx);
  // Send normal page
  ctx.response.body = await ctx.state.cache.get("./resources/html/index.html");
});

lobbyRouter.get("/get_code", function (ctx) {
  ctx.state.tracker(ctx);
  const code = crypto.randomUUID().substring(0, 8);
  const game = new Game(code);
  ctx.state.games.set(code, game);

  const abort = () => {
    ctx.state.games.delete(code);
    game.abortController.signal.removeEventListener("abort", abort);
  };

  // Add listener for abort function
  game.abortController.signal.addEventListener("abort", abort);

  ctx.response.body = code;
});

lobbyRouter.get("/:id", async function (ctx) {
  ctx.state.tracker(ctx);
  if (ctx.state.games.has(ctx.params.id)) {
    // Send lobby page
    ctx.response.body = await ctx.state.cache.get(
      "./resources/html/player.html",
    );
  } else {
    // Bad request. Lobby does not exist
    ctx.response.body = "This lobby does not exist";
    ctx.response.status = 400;
  }
});

export { lobbyRouter };
