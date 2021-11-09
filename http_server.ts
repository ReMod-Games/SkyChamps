import { Application, Level } from "./deps.ts";
import { lobbyRouter } from "./routers/lobby_router.ts";
import { resourceRouter } from "./routers/resource_router.ts";
import { Cache } from "./utils/cache.ts";
import { log, tracker } from "./utils/worker_logger.ts";

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

httpServer.addEventListener(
  "error",
  (e) => log(Level.Error, `HTTPServer Error: "${e.error}" ${e.message}`),
);
httpServer.use(lobbyRouter.allowedMethods());
httpServer.use(lobbyRouter.routes());

httpServer.use(resourceRouter.allowedMethods());
httpServer.use(resourceRouter.routes());

log(Level.Info, "HTTP Server has started!");
await httpServer.listen(httpServer.state.serverConfig);
