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
const connectionPromise = new Promise((res) => socket.onopen = res);
socket.onmessage = messageHandler;

onload = () => {
  console.log("REEEEE");
  GAME_STATE.opp.element = document.getElementById(
    "opp_deck",
  )! as HTMLDivElement;
  GAME_STATE.self.element = document.getElementById(
    "self_deck",
  )! as HTMLDivElement;

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
    const { opp, self } = GAME_STATE.selectedCards;
    if (!self.index) {
      addErrorMessage("Please select a card to attack with");
      return;
    }
    if (self.type === "private") {
      addErrorMessage("Please select a card that you've played");
      return;
    }
    if (!opp.index || opp.type === "private") {
      addErrorMessage("Please select a card to attack");
      return;
    }

    console.log({ self, opp });
    const payload: GameEvents.Attack = {
      type: "attack",
      attackerCardIndex: self.index,
      defenderCardIndex: opp.index,
    };

    socket.send(JSON.stringify(payload));
    GAME_STATE.selectedCards = {
      opp: { type: null, index: null },
      self: { type: null, index: null },
    };
  };

  document.getElementById("play_card")!.onclick = () => {
    const { self } = GAME_STATE.selectedCards;
    if (!self.index) {
      addErrorMessage("Please select a card to play!");
      return;
    }
    if (self.type === "public") {
      addErrorMessage("Please select a card from your hand!");
      return;
    }
    const payload: GameEvents.PlayCard = {
      type: "play_card",
      cardIndex: self.index,
    };

    socket.send(JSON.stringify(payload));
  };

  document.getElementById("draw_card")!.onclick = () => {
    const payload: GameEvents.DrawCard = {
      type: "draw_card",
    };
    socket.send(JSON.stringify(payload));
  };

  document.getElementById("end_turn")!.onclick = () => {
    const payload: GameEvents.EndTurn = {
      type: "end_turn",
    };
    socket.send(JSON.stringify(payload));
  };
};

await connectionPromise;
