/// <reference lib="dom"/>

import { messageHandler } from "./game_logic.js";

const [gameID, username] = location.pathname.replace("/lobby/", "").split("/");

const socket = new WebSocket(
  `ws://${location.hostname}:8001/${gameID}/${username}`,
);
await new Promise((res) => socket.onopen = res);
socket.onmessage = messageHandler;
