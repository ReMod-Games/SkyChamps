// deno-lint-ignore-file camelcase
// deno-fmt-ignore-file
import type { PreparedQuery } from "../../deps.ts";

// Type aliases for clearer understanding
type DateString = string;
type MatchID = string;
type PlayerID = 0 | 1;
type PlayerName = string;
type EventData = string;
type Message = string;
type CardID = number;
type CardName = string;
type CardDescription = string;
type CardHealth = number;
type CardAttackDamage = number;
type CardAttackName = string;
type CardAbilityName = string;
type CardCritChance = number;

type AddMatch = PreparedQuery<never, never, [MatchID, DateString]>;
type GetMatchByID = PreparedQuery<never, { match_id: MatchID, started_at: DateString }, [MatchID]>;
interface MatchQueries {
  addMatch: AddMatch;
  getMatchByID: GetMatchByID;
}

type AddPlayer = PreparedQuery<never, never, [MatchID, PlayerID, PlayerName]>;
type GetPlayerByMatchID = PreparedQuery<never, { player_id: PlayerID, player_name: PlayerName }, [MatchID]>;
interface MatchPlayerQueries {
  addPlayer: AddPlayer;
  getPlayersByMatchID: GetPlayerByMatchID;
}

type AddMessage = PreparedQuery<never, never, [DateString, Message, PlayerID, MatchID]>;
type GetMessagesByMatchID = PreparedQuery<never, { date: DateString, message: Message, player_id: PlayerID }, [MatchID]>;
interface ChatQueries {
  addMessage: AddMessage;
  getMessagesByMatchID: GetMessagesByMatchID;
}

type AddSpecialEvent = PreparedQuery<never, never, [DateString, EventData, PlayerID, MatchID]>;
type GetSpecialEventsByMatchID = PreparedQuery<never, { date: DateString, event_data: EventData, player_id: PlayerID }, [MatchID]>;
interface SpecialEventQueries {
  addEvent: AddSpecialEvent;
  getEventsByMatchID: GetSpecialEventsByMatchID;
}

type AddCardEvent = PreparedQuery<never, never, [DateString, CardID, EventData, PlayerID, MatchID]>;
type GetEventsByMatchID = PreparedQuery<never, { date: DateString, card_id: CardID, event_data: EventData, player_id: PlayerID }, [MatchID]>;
interface CardEventQueries {
  addEvent: AddCardEvent;
  getEventsByMatchID: GetEventsByMatchID;
}

interface CardRecord extends Record<string, unknown> {
  card_id: CardID;
  card_name: CardName;
  card_description: CardDescription;
  card_health: CardHealth;
  card_attack_dmg: CardAttackDamage;
  card_attack_name: CardAttackName;
  card_ability_name: CardAbilityName;
  card_crit_chance: CardCritChance;
}

type GetCardByID = PreparedQuery<never, CardRecord, [CardID]>;
type GetCardByName = PreparedQuery<never, CardRecord, [CardName]>;
type GetRandomCard = PreparedQuery<never, CardRecord>;
type GetRandomCards = PreparedQuery<never, CardRecord, [number]>;
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
