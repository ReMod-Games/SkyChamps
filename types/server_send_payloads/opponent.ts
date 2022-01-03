import type { CardJson } from "../card.ts";

// Opponent draw
export interface OppDraw {
  type: "opp_draw";
  cardIndex: number;
}

// Opponent play
export interface OppPlay {
  type: "opp_play";
  cardFromIndex: number;
  cardToIndex: number;
  card: CardJson;
}

// Opponent attack
export interface OppAttack {
  type: "opp_attack";
  attackCardIndex: number;
  defendCardIndex: number; // -1 if player
  damage: number;
}

// export interface OppAbility {
//   type: "opp_ability";
//   cardIndex: number;
//   receiver: string; // "opp" | "opp_card" | "self_card",
//   receiverIndex: number; // is -1 if receiver is "opp"
//   abilityType: string; // "attack" | "passive"
//   damage?: number; // Only present if "abilityType" is "attack"
// }

export interface OppDied {
  type: "opp_died";
  cardIndex: number; // -1 if player is killed
}

// export interface OppEffectDOT {
//   type: "opp_effect_dot";
//   cardIndex: number; // -1 if player
//   damage: number;
// }

export interface OppEndTurn {
  type: "opp_end_turn";
}

export type AnyOppEvent =
  | OppDraw
  | OppPlay
  | OppAttack
  // | OppAbility
  | OppDied
  // | OppEffectDOT
  | OppEndTurn;
