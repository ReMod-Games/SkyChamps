import { Router } from "../deps.ts";
import { Game } from "../utils/match/game.ts";
import type { WebSocketState } from "../types/server_internals.ts";

const gameRouter = new Router<{ id: string; name: string }, WebSocketState>();

gameRouter.get("/:id/:name", async function (ctx) {
  ctx.state.tracker(ctx);
  const gameID = ctx.params.id;
  const game = ctx.state.games.get(gameID);
  if (!game) return ctx.response.status = 400;

  await game.addClient(await ctx.upgrade(), ctx.params.name);
  if (game.playercount === 2) {
    game.startGame();
  }
});

gameRouter.get("/get_code", function (ctx) {
  ctx.state.tracker(ctx);
  const code = crypto.randomUUID().substring(0, 8);
  const game = new Game(code);
  ctx.state.games.set(code, game);

  // Add listener for abort function
  game.abortController.signal.addEventListener(
    "abort",
    () => ctx.state.games.delete(code),
    { once: true },
  );

  ctx.response.body = code;
});

export { gameRouter };
