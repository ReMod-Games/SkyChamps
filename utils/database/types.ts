// deno-lint-ignore-file camelcase
import type { PreparedQuery } from "../../deps.ts";

// Type aliases for clearer understanding
type DateString = string;
type CardDescription = string;
type CardHealth = number;
type CardAttackDamage = number;
type CardAttackName = string;
type CardAbilityName = string;
type CardCritChance = number;

export type MatchID = string;
export type PlayerID = 0 | 1;
export type PlayerName = string;
export type EventData = string;
export type Message = string;
export type CardID = number;
export type CardName = string;

export interface MatchRecord extends Record<string, unknown> {
  match_id: MatchID;
  started_at: DateString;
}

type AddMatch = PreparedQuery<[], never, [MatchID, DateString]>;
type GetMatchByID = PreparedQuery<[], MatchRecord, [MatchID]>;
interface MatchQueries {
  addMatch: AddMatch;
  getMatchByID: GetMatchByID;
}

export interface PlayerRecord extends Record<string, unknown> {
  player_id: PlayerID;
  player_name: PlayerName;
}

type AddPlayer = PreparedQuery<[], never, [MatchID, PlayerID, PlayerName]>;
type GetPlayerByMatchID = PreparedQuery<[], PlayerRecord, [MatchID]>;
interface MatchPlayerQueries {
  addPlayer: AddPlayer;
  getPlayersByMatchID: GetPlayerByMatchID;
}

export interface MessageRecord extends Record<string, unknown> {
  date: DateString;
  message: Message;
  player_id: PlayerID;
}

// deno-fmt-ignore
type AddMessage = PreparedQuery<[], never, [DateString, Message, PlayerID, MatchID]>;
type GetMessagesByMatchID = PreparedQuery<[], MessageRecord, [MatchID]>;
interface ChatQueries {
  addMessage: AddMessage;
  getMessagesByMatchID: GetMessagesByMatchID;
}

export interface SpecialEventRecord extends Record<string, unknown> {
  date: DateString;
  event_data: EventData;
  player_id: PlayerID;
}
// deno-fmt-ignore
type AddSpecialEvent = PreparedQuery<[], never, [DateString, EventData, PlayerID, MatchID]>;
// deno-fmt-ignore
type GetSpecialEventsByMatchID = PreparedQuery<[], SpecialEventRecord, [MatchID]>;
interface SpecialEventQueries {
  addEvent: AddSpecialEvent;
  getEventsByMatchID: GetSpecialEventsByMatchID;
}

export interface CardEventRecord extends Record<string, unknown> {
  date: DateString;
  card_id: CardID;
  event_data: EventData;
  player_id: PlayerID;
}

// deno-fmt-ignore
type AddCardEvent = PreparedQuery<[], never, [DateString, CardID, EventData, PlayerID, MatchID]>;
type GetCardEventsByMatchID = PreparedQuery<[], CardEventRecord, [MatchID]>;
interface CardEventQueries {
  addEvent: AddCardEvent;
  getEventsByMatchID: GetCardEventsByMatchID;
}

export interface CardRecord extends Record<string, unknown> {
  card_id: CardID;
  card_name: CardName;
  card_description: CardDescription;
  card_health: CardHealth;
  card_attack_dmg: CardAttackDamage;
  card_attack_name: CardAttackName;
  card_ability_name: CardAbilityName;
  card_crit_chance: CardCritChance;
}

type GetCardByID = PreparedQuery<[], CardRecord, [CardID]>;
type GetCardByName = PreparedQuery<[], CardRecord, [CardName]>;
type GetRandomCard = PreparedQuery<[], CardRecord>;
type GetRandomCards = PreparedQuery<[], CardRecord, [number]>;
interface CardQueries {
  getCardByID: GetCardByID;
  getCardByName: GetCardByName;
  getRandomCard: GetRandomCard;
  getRandomCards: GetRandomCards;
}

export interface Queries {
  matches: MatchQueries;
  matchPlayer: MatchPlayerQueries;
  matchChatMessages: ChatQueries;
  matchSpecialEvent: SpecialEventQueries;
  matchCardEvent: CardEventQueries;
  cards: CardQueries;
}
