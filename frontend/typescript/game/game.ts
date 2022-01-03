/// <reference lib="dom"/>

import { messageHandler } from "./game_logic.js";
import { GAME_STATE } from "./state.js";
import { addErrorMessage } from "./dom_manipulate.js";
import type {
  GameEvents,
  MiscEvents,
} from "../../../types/client_send_payloads/mod.ts";
const [gameID, username] = location.pathname.replace("/lobby/", "").split("/");

const socket = new WebSocket(
  `ws://${location.hostname}:8001/${gameID}/${username}`,
);
await new Promise((res) => socket.onopen = res);
socket.onmessage = messageHandler;

document.getElementById("chat_input")!.onsubmit = (evt) => {
  const message = (evt.submitter as HTMLInputElement).value;
  const struct: MiscEvents.ChatMessage = {
    type: "chat_message",
    message,
    user: username,
  };
  (evt.submitter as HTMLInputElement).value = "";
  socket.send(JSON.stringify(struct));
};

document.getElementById("attack")!.onclick = () => {
  const { opp: oppIndex, self: selfIndex } = GAME_STATE.hightlightedCards;
  if (!selfIndex) {
    addErrorMessage("Please select a card to attack with");
    return;
  }
  if (!oppIndex) {
    addErrorMessage("Please select a card to attack");
    return;
  }
  const payload: GameEvents.Attack = {
    type: "attack",
    attackerCardIndex: selfIndex,
    defenderCardIndex: oppIndex,
  };

  socket.send(JSON.stringify(payload));
};
