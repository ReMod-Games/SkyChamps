/** All the events in this file are sent from the client */

export interface Connect {
  kind: "connect";
  username: string;
}

export interface SendMessage {
  kind: "send_msg";
  message: string;
}

// From card pool to your "hand"
export interface DrawCard {
  kind: "draw_card";
}

// from your "hand" to the table
export interface PlayCard {
  kind: "play_card";
}

// Attack a card of the opponent
export interface Attack {
  kind: "attack";
  attacker: number;
  defender?: number;
}

// Use a ability on the card itself
export interface AbilitySelf {
  kind: "ability_self";
  card: number;
}

// Use a ability on a allied card
export interface AbilityAlly {
  kind: "ability_ally";
  card: number;
  ally: number;
}

// Use a ability on the opponent's card
export interface AbilityOpponent {
  kind: "ability_opponent";
  card: number;
  opponent: number;
}

export interface Disconnect {
  kind: "disconnect";
  reason?: string;
}

export type Event =
  | Connect
  | SendMessage
  | DrawCard
  | PlayCard
  | Attack
  | AbilitySelf
  | AbilityAlly
  | AbilityOpponent
  | Disconnect;
