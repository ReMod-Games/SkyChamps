import { Router } from "../deps.ts";
import { Lobby } from "../utils/lobbies.ts";
import type { ServerState } from "../types.ts";
/**
 * Websocket stuff
 */

const gameRouter = new Router<{ id: string }, ServerState>({
  prefix: "/game",
});

gameRouter.get("/:id", async function (ctx) {
  if (!ctx.params.id) return ctx.response.status = 400;
  let lobby = ctx.state.lobbies.get(ctx.params.id);
  if (!lobby) {
    lobby = new Lobby();
    ctx.state.lobbies.set(ctx.params.id, lobby);
  }

  lobby.addPlayer(await ctx.upgrade());
  if (lobby.playerCount >= 2) {
    lobby.startGame();
  }
});

export { gameRouter };
