import { Router } from "../deps.ts";
import { Lobby } from "../utils/lobby.ts";
import type { ServerState } from "../types.ts";

const gameRouter = new Router<{ id: string }, ServerState>({
  prefix: "/game",
});

gameRouter.get("/:id", async function (ctx) {
  const lobbyID = ctx.params.id;
  let lobby = ctx.state.lobbies.get(lobbyID);
  if (!lobby) {
    lobby = new Lobby(lobbyID);
    ctx.state.lobbies.set(lobbyID, lobby);
  }

  if (lobby.playerCount < 2) lobby.addPlayer(await ctx.upgrade());
  if (lobby.playerCount === 2) {
    lobby.abortController.signal.onabort = () =>
      ctx.state.lobbies.delete(lobbyID);
    lobby.startGame();
  }
});

export { gameRouter };
