import { CARD_CACHE } from "../cards/cards_cache.ts";
import { isValidPayload } from "./validate_payload.ts";
import * as Errors from "./game_errors.ts";

import type { AnyClientEvent } from "../../types/client_send_payloads/mod.ts";
import type { Player } from "./clients.ts";
import type { Game } from "./game.ts";

const NON_TURN_BASED_EVENTS = ["chat_message", "disconnect"];

export function gameEventHandler(
  evt: MessageEvent<string>,
  game: Game,
  playerID: number,
): void {
  // Handle incoming events from players
  const player = game.players[playerID];

  const eventRecord: AnyClientEvent = JSON.parse(evt.data);
  // Check if it's player's turn and if the action requires a turn
  if (
    game.state.turn % 2 !== playerID &&
    !NON_TURN_BASED_EVENTS.includes(eventRecord.type)
  ) {
    return player.sendEvent(Errors.NOT_YOUR_TURN);
  }

  const opponent = game.players[playerID === 0 ? 1 : 0];

  switch (eventRecord.type) {
    case "draw_card": {
      // Validate action
      if (!isValidPayload(eventRecord, ["type"])) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      // Get card from db
      const card = CARD_CACHE.getRandomCard();

      // Add card to player deck
      const index = player.deck.addCard(card);

      // Send events
      player.sendEvent({ type: "self_draw", cardIndex: index, card });
      opponent.sendEvent({ type: "opp_draw", cardIndex: index });

      break;
    }

    case "play_card": {
      // Validate action
      if (!isValidPayload(eventRecord, ["type", "cardIndex"])) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      // Add card to `game.gameState`
      const card = player.deck.moveCard(eventRecord.cardIndex);
      if (!card) {
        return player.sendEvent(Errors.INVALID_CARD_INDEX);
      }
      const index = game
        .state.playerDecks[playerID]
        .addCard(card);

      player.sendEvent({ type: "self_play", cardIndex: index });
      opponent.sendEvent({ type: "opp_play", cardIndex: index, card });
      break;
    }

    case "attack": {
      // Validate action
      if (
        !isValidPayload(
          eventRecord,
          ["type", "attackerCardIndex", "defenderCardIndex"],
        )
      ) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }
      const attackIndex = eventRecord.attackerCardIndex;
      const defenderIndex = eventRecord.defenderCardIndex;
      const attacker = game
        .state.playerDecks[playerID]
        .getCard(attackIndex);

      if (!attacker) {
        return player.sendEvent(Errors.INVALID_CARD_INDEX);
      }

      // Determine damage
      const damage = attacker.attackDamage *
        (Math.random() < attacker.critChance ? attacker.critFactor : 1);

      // Safety check to avoid damaging the player too early
      if (defenderIndex === -1 && opponent.deck.length > 0) {
        // return `Invalid action`
        return player.sendEvent(Errors.INVALID_CARD_INDEX);
      }

      if (defenderIndex === -1) {
        // If not card is selected and no cards on enemy field, attack enemy `Playerhp` at 0.10x
        player.hp -= damage * 0.25;
      } else {
        // Get deck from player
        const deck = game.state.playerDecks[opponent.id];
        // Modify card in the deck
        const card = deck.modifyCard(
          defenderIndex,
          (card) => card.health -= damage,
        );

        if (!card) return player.sendEvent(Errors.INVALID_CARD_INDEX);

        player.sendEvent({
          type: "self_attack",
          attackCardIndex: attackIndex,
          defendCardIndex: defenderIndex,
          damage,
        });

        opponent.sendEvent({
          type: "opp_attack",
          attackCardIndex: attackIndex,
          defendCardIndex: defenderIndex,
          damage,
        });
      }
      break;
    }

    case "ability": {
      // Validate action
      if (
        !isValidPayload(eventRecord, [
          "type",
          "cardIndex",
          "receiver",
          "receiverIndex",
          "abilityType",
          "damage",
        ])
      ) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      const abilityName = player
        .deck
        .getCard(eventRecord.cardIndex)
        ?.abilityName;

      if (!abilityName) {
        return player.sendEvent(Errors.INVALID_CARD_INDEX);
      }
      // Either executes or queue's ability depending on it's name
      activatePlayerAbility(abilityName, player, opponent);
      break;
    }

    case "end_turn": {
      // Validate action
      if (!isValidPayload(eventRecord, ["type"])) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      // Send end turn event
      player.sendEvent({ type: "self_end_turn" });
      opponent.sendEvent({ type: "opp_end_turn" });
      break;
    }

    case "disconnect": {
      // Validate action
      if (!isValidPayload(eventRecord, ["type"])) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      opponent.sendEvent({ type: "game_win" });
      // Send win to opp
      // Close all connections and clean up
      player.cleanUp();
      opponent.cleanUp();
      return;
    }

    case "chat_message": {
      // Validate action
      if (!isValidPayload(eventRecord, ["type", "message", "user"])) {
        return player.sendEvent(Errors.INVALID_PAYLOAD);
      }

      // Resend message to Opp and Self
      return game.sendGlobalEvent(eventRecord);
    }

    default:
      // If event is not valid. Return error
      return player.sendEvent({
        type: "error",
        error: "Invalid Event",
        message: `Tried to send invalid event.`,
      });
  }

  game.state.nextTurn();
}

function activatePlayerAbility(
  abilityName: string,
  _player: Player,
  _opponent: Player,
): void {
  switch (abilityName) {
    // TODO: add all abilities
    // TODO: Remove default case (not needed)
    default:
      break;
  }
}
