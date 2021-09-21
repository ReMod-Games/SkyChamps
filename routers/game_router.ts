import { Router } from "../deps.ts";
import type { ServerState } from "../types.ts";

const gameRouter = new Router<{ id: string }, ServerState>({
  prefix: "/game",
});

gameRouter.get("/:id", async function (ctx) {
  const lobbyID = ctx.params.id;
  const lobby = ctx.state.lobbies.get(lobbyID);
  if (!lobby) return ctx.response.status = 400;

  if (lobby.playerCount < 2) await lobby.addPlayer(await ctx.upgrade());
  if (lobby.playerCount === 2) {
    lobby.abortController.signal.onabort = () =>
      ctx.state.lobbies.delete(lobbyID);
    lobby.startGame();
  }
});

export { gameRouter };
