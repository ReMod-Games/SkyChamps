export interface DrawCard {
  type: "draw_card";
}

export interface Attack {
  type: "attack";
  attackerCardIndex: number;
  defenderCardIndex: number; // -1 if player
}

export interface Ability {
  type: "ability";
  cardIndex: number;
  receiver: string; // "self" | "self_card" | "opp_card"
  receiverIndex: number; // is -1 if receiver is "self"
  abilityType: string; // "attack" | "passive"
  damage: number; // -1 if "abilityType" is "passive"
}

export interface PlayCard {
  type: "play_card";
  cardIndex: number;
}

export interface EndTurn {
  type: "end_turn";
}

export type AnyGameEvent = DrawCard | Attack | Ability | PlayCard | EndTurn;
