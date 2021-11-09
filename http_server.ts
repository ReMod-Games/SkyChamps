/// <reference lib="webworker"/>

import { Application } from "./deps.ts";
import { lobbyRouter } from "./routers/lobby_router.ts";
import { resourceRouter } from "./routers/resource_router.ts";
import { Cache } from "./utils/cache.ts";
import { logger, tracker } from "./utils/logger.ts";

import type { HTTPState } from "./types/server_internals.ts";

const httpServer = new Application<HTTPState>({
  contextState: "alias",
  state: {
    cache: new Cache(),
    tracker,
    serverConfig: {
      port: 8000,
      protocol: "tcp",
    },
  },
});

httpServer.addEventListener("error", (e) => logger.error(e) as unknown as void);
httpServer.use(lobbyRouter.allowedMethods());
httpServer.use(lobbyRouter.routes());

httpServer.use(resourceRouter.allowedMethods());
httpServer.use(resourceRouter.routes());

logger.info("HTTP Server has started!");
await httpServer.listen(httpServer.state.serverConfig);
