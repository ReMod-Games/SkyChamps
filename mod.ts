import { startWorker } from "./utils/worker.ts";

const baseURL = import.meta.url;

const httpServerImportURL = new URL("./http_server.ts", baseURL);
const websocketImportURL = new URL("./websocket_server.ts", baseURL);

startWorker(httpServerImportURL, "HTTP Server");

startWorker(websocketImportURL, "WebSocket server");
