/// <reference lib="dom"/>
import type {
  AnyServerEvent,
  MiscEvents as _,
  OppEvents as _1,
  SelfEvents as _2,
} from "../../../types/server_send_payloads/mod.ts";

export function messageHandler(messageEvent: MessageEvent<string>) {
  const event: AnyServerEvent = JSON.parse(messageEvent.data);

  switch (event.type) {
    // Misc Events
    case "game_win": {
      break;
    }
    case "game_loss": {
      break;
    }
    case "game_draw": {
      break;
    }
    case "game_start": {
      break;
    }
    case "game_cancel": {
      break;
    }
    case "error": {
      break;
    }
    case "chat_message": {
      break;
    }

    // Opp Events

    case "opp_draw": {
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
      break;
    }

    // Self Events

    case "self_draw": {
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
      break;
    }
  }
}
