import { startWorker } from "./utils/worker.ts";

const httpServerImportURL = new URL("./http_server.ts", import.meta.url);
const websocketImportURL = new URL("./websocket_server.ts", import.meta.url);

startWorker(httpServerImportURL, {
  type: "module",
  name: "http server",
  deno: {
    permissions: "inherit",
    namespace: true,
  },
});

startWorker(websocketImportURL, {
  type: "module",
  name: "websocket server",
  deno: {
    permissions: "inherit",
    namespace: true,
  },
});
