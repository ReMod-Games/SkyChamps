import { Application, Level } from "./deps.ts";
import { gameRouter } from "./routers/game_router.ts";
import { log, tracker } from "./utils/worker_logger.ts";

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

wsServer.addEventListener(
  "error",
  (e) => log(Level.Error, `WebSocket Error: "${e.error}" ${e.message}`),
);
wsServer.use(gameRouter.allowedMethods());
wsServer.use(gameRouter.routes());

log(Level.Info, "WebSocket Server has started!");
await wsServer.listen(wsServer.state.serverConfig);
