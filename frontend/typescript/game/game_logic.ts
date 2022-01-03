/// <reference lib="dom"/>
import type {
  AnyServerEvent,
  MiscEvents as _,
  OppEvents as _1,
  SelfEvents as _2,
} from "../../../types/server_send_payloads/mod.ts";

import { GAME_STATE } from "./state.js";

import {
  addChatMessage,
  addErrorMessage,
  addGameMessage,
  setTimer,
} from "./dom_manipulate.js";

export function messageHandler(messageEvent: MessageEvent<string>) {
  const event: AnyServerEvent = JSON.parse(messageEvent.data);
  console.log(event);
  switch (event.type) {
    // Misc Events
    case "game_win": {
      addGameMessage("Game ended and You won :D");
      break;
    }
    case "game_loss": {
      addGameMessage("Game ended and You lost :C");
      break;
    }
    case "game_draw": {
      addGameMessage("Game ended in a draw!");
      break;
    }
    case "game_start": {
      addGameMessage("Game has started!");
      break;
    }
    case "game_cancel": {
      addGameMessage("Game has been canceled!");
      break;
    }
    case "error": {
      addErrorMessage(event.error + ":" + event.message);
      break;
    }
    case "chat_message": {
      addChatMessage(event.message, event.user);
      break;
    }
    case "timer": {
      const now = Date.now();
      const time = new Date(event.date).getTime();

      setTimer((time - now) / 1000, 1000);
      break;
    }
    // Opp Events
    case "opp_draw": {
      GAME_STATE.addCard("opp", "private", event.cardIndex);
      break;
    }
    case "opp_play": {
      GAME_STATE.removeCard("opp", "private", event.cardFromIndex);
      GAME_STATE.addCard("opp", "public", event.cardToIndex, event.card);
      break;
    }
    case "opp_attack": {
      GAME_STATE.modifyCard(
        "self",
        event.defendCardIndex,
        (card) => card.health -= event.damage,
      );
      break;
    }
    case "opp_died": {
      GAME_STATE.removeCard("opp", "public", event.cardIndex);
      break;
    }
    case "opp_end_turn": {
      // Enable buttons again
      break;
    }

    // Self Events

    case "self_draw": {
      GAME_STATE.addCard("self", "private", event.cardIndex, event.card);
      break;
    }
    case "self_play": {
      const card = GAME_STATE.getCard("self", "private", event.cardFromIndex);
      GAME_STATE.addCard("self", "public", event.cardToIndex, card);
      break;
    }
    case "self_attack": {
      GAME_STATE.modifyCard(
        "opp",
        event.defendCardIndex,
        (card) => card.health -= event.damage,
      );
      break;
    }
    case "self_died": {
      GAME_STATE.removeCard("self", "public", event.cardIndex);
      break;
    }
    case "self_end_turn": {
      // Disable buttons
      break;
    }
  }
}
