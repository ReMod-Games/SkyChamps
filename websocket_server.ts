import { Application } from "./deps.ts";
import { gameRouter } from "./routers/game_router.ts";
import { logger, tracker } from "./utils/logger.ts";
import { cardCache } from "./utils/cards/cards_cache.ts";

import type { WebSocketState } from "./types.ts";

const wsServer = new Application<WebSocketState>({
  contextState: "alias",
  state: {
    tracker,
    games: new Map(),
    cardCache,
    serverConfig: {
      port: 8001,
      protocol: "tcp",
    },
  },
});

wsServer.addEventListener("error", (e) => logger.error(e) as unknown as void);
wsServer.use(gameRouter.allowedMethods());
wsServer.use(gameRouter.routes());

await wsServer.listen(wsServer.state.serverConfig);
