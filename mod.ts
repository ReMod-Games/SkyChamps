import { Application } from "./deps.ts";
import { lobbyRouter } from "./routers/lobby_router.ts";
import { gameRouter } from "./routers/game_router.ts";
import { resourceRouter } from "./routers/resource_router.ts";
import { Cache } from "./utils/cache.ts";
import { logger, tracker } from "./utils/logger.ts";

import type { ServerState } from "./types.ts";

const app = new Application<ServerState>({
  contextState: "alias",
  state: {
    games: new Map(),
    cache: new Cache(),
    tracker,
  },
});

app.addEventListener("error", (e) => logger.error(e) as unknown as void);
app.use(lobbyRouter.allowedMethods());
app.use(lobbyRouter.routes());

app.use(gameRouter.allowedMethods());
app.use(gameRouter.routes());

app.use(resourceRouter.allowedMethods());
app.use(resourceRouter.routes());

await app.listen({ port: 8000 });
