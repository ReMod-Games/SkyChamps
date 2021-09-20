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
  const lobbyID = ctx.params.id;
  // If no ID is provided, return error
  if (!lobbyID) return ctx.response.status = 400;
  let lobby = ctx.state.lobbies.get(lobbyID);
  if (!lobby) {
    lobby = new Lobby(lobbyID);
    ctx.state.lobbies.set(lobbyID, lobby);
  }

  lobby.addPlayer(await ctx.upgrade());
  if (lobby.playerCount === 2) {
    lobby.startGame();
  }
});

export { gameRouter };
