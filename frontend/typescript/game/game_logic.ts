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

    // Opp Events

    case "opp_draw": {
      GAME_STATE.addCard("opp", event.cardIndex);
      break;
    }
    case "opp_play": {
      break;
    }
    case "opp_attack": {
      break;
    }
    case "opp_ability": {
      break;
    }
    case "opp_kill": {
      break;
    }
    case "opp_effect_dot": {
      break;
    }
    case "opp_end_turn": {
      // Enable buttons again
      break;
    }

    // Self Events

    case "self_draw": {
      GAME_STATE.addCard("self", event.cardIndex, event.card);
      break;
    }
    case "self_play": {
      break;
    }
    case "self_attack": {
      break;
    }
    case "self_ability": {
      break;
    }
    case "self_kill": {
      break;
    }
    case "self_effect_dot": {
      break;
    }
    case "self_end_turn": {
      // Disable buttons
      break;
    }
  }
}
