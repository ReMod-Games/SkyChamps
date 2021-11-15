import type { CardJson } from "../card.ts";

// Opponent

// Opponent draw
export interface OppDraw {
  type: "opp_draw";
  cardIndex: number;
}

// Opponent play
export interface OppPlay {
  type: "opp_play";
  cardIndex: number;
  card: CardJson;
}

// Opponent attack
export interface OppAttack {
  type: "opp_attack";
  attackCardIndex: number;
  defendCardIndex: number; // -1 if player
  damage: number;
}

// Opponent attack
export interface OppAbility {
  type: "opp_ability";
  cardIndex: number;
  receiver: string; // "opp" | "opp_card" | "self_card",
  receiverIndex: number; // is -1 if receiver is "opp"
  abilityType: string; // "attack" | "passive"
  damage?: number; // Only present if "abilityType" is "attack"
}

export interface OppKill {
  type: "opp_kill";
  cardIndex: number; // -1 if player is killed
}

export interface OppEffectDOT {
  type: "opp_effect_dot";
  cardIndex: number; // -1 if player
  damage: number;
}

export interface OppEndTurn {
  type: "opp_end_turn";
}

export interface OppStartTurn {
  type: "opp_start_turn";
}

export type AnyOppEvent =
  | OppDraw
  | OppPlay
  | OppAttack
  | OppAbility
  | OppKill
  | OppEffectDOT
  | OppEndTurn
  | OppStartTurn;
