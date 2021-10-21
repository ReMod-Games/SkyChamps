const httpServerImportURL = new URL("./http_server.ts", import.meta.url);
const websocketImportURL = new URL("./websocket_server.ts", import.meta.url);

const _httpServer = new Worker(httpServerImportURL, {
  type: "module",
  name: "http server",
  deno: {
    permissions: {
      net: ["0.0.0.0"],
      read: ["./resources"],
    },
    namespace: true,
  },
});

const _websocketServer = new Worker(websocketImportURL, {
  type: "module",
  name: "websocket server",
  deno: {
    permissions: {
      net: ["0.0.0.0"],
    },
    namespace: true,
  },
});
