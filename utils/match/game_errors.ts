import type { MiscEvents } from "../../types/server_send_payloads/mod.ts"

export const INVALID_PAYLOAD: MiscEvents.ServerError = {
  type: "error",
  error: "Invalid payload",
  message: "Payload that was send is invalid",
};

export const INVALID_CARD_INDEX: MiscEvents.ServerError = {
  type: "error",
  error: "Invalid card index",
  message: "Card could not be found",
};

export const NOT_YOUR_TURN: MiscEvents.ServerError = {
  type: "error",
  error: "Illegal actions",
  message: "Tried to use a move while it is not your turn",
};