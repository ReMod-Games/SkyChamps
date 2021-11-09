/// <reference lib="webworker"/>

import { Application } from "./deps.ts";
import { gameRouter } from "./routers/game_router.ts";
import { logger, tracker } from "./utils/logger.ts";

import type { WebSocketState } from "./types/server_internals.ts";

const wsServer = new Application<WebSocketState>({
  contextState: "alias",
  state: {
    tracker,
    games: new Map(),
    serverConfig: {
      port: 8001,
      protocol: "tcp",
    },
  },
});

wsServer.addEventListener("error", (e) => logger.error(e) as unknown as void);
wsServer.use(gameRouter.allowedMethods());
wsServer.use(gameRouter.routes());

logger.info("WebSocket Server has started!");
await wsServer.listen(wsServer.state.serverConfig);
