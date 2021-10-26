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
  attackerCardIndex: number;
  defenderCardIndex: number; // -1 if player
}

export interface PlayCard {
  type: "play_card";
  cardIndex: number;
}

export interface EndTurn {
  type: "end_turn";
}

export type AnyGameEvent = DrawCard | Attack | Ability | PlayCard | EndTurn;
