const httpServerImportURL = new URL("./http_server.ts", import.meta.url);
const websocketImportURL = new URL("./websocket_server.ts", import.meta.url);

const _httpServer = new Worker(httpServerImportURL, {
  type: "module",
  name: "http server",
  deno: {
    permissions: "inherit",
    namespace: true,
  },
});

const _websocketServer = new Worker(websocketImportURL, {
  type: "module",
  name: "websocket server",
  deno: {
    permissions: "inherit",
    namespace: true,
  },
});
