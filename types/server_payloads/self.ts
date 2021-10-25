import type { CardJson } from "../card.ts";

// Self

// Self draw
export interface SelfDraw {
  type: "self_draw";
  cardIndex: number;
  card: CardJson;
}

// Self play
export interface SelfPlay {
  type: "self_play";
  cardIndex: number;
}

// Self attack
export interface SelfAttack {
  type: "self_attack";
  attackCardIndex: number;
  defendCardIndex: number; // If -1 it's player
  damage: number;
}

// Self attack
export interface SelfAbility {
  type: "self_ability";
  cardIndex: number;
  receiver: string; // "self" | "self_card" | "opp_card"
  receiverIndex: number; // is -1 if receiver is "self"
  abilityType: string; // "attack" | "passive"
  damage?: number; // Only present if "abilityType" is "attack"
}

export interface SelfKill {
  type: "self_kill";
  cardIndex: number; // -1 if no player is killed
}

export interface SelfEffectDOT {
  type: "self_effect_dot";
  cardIndex: number; // -1 if player
  damage: number;
}
