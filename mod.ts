import { Application } from "./deps.ts";
import { Lobby } from "./utils/lobbies.ts";
import { lobbyRouter } from "./routers/lobby_router.ts";
import { gameRouter } from "./routers/game_router.ts";

interface State {
  lobbies: Map<string, Lobby>;
}

const app = new Application<State>({ state: { lobbies: new Map() } });

app.use(lobbyRouter.allowedMethods());
app.use(lobbyRouter.routes());

app.use(gameRouter.allowedMethods());
app.use(gameRouter.routes());

await app.listen({ port: 8000 });
