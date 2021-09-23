import { Router } from "../deps.ts";
import type { ServerState } from "../types.ts";

const gameRouter = new Router<{ id: string, name: string }, ServerState>({
  prefix: "/game",
});

gameRouter.get("/:id/:name", async function (ctx) {
  const gameID = ctx.params.id;
  const game = ctx.state.games.get(gameID);
  if (!game) return ctx.response.status = 400;

  await game.addClient(await ctx.upgrade(), ctx.params.name);
  if (game.playercount === 2) {
    game.startGame();
  }
});

export { gameRouter };
