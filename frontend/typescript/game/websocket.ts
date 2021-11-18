/// <reference lib="dom"/>
import { messageHandler } from "./game_logic.js";

import type {
  AnyClientEvent,
  MiscEvents as _,
} from "../../../types/client_send_payloads/mod.ts";

const url = location.href;
console.log(url);
const ws = new WebSocket(url);

ws.onmessage = messageHandler;

export const identity = "";

export function send(evt: AnyClientEvent) {
  ws.send(JSON.stringify(evt));
}