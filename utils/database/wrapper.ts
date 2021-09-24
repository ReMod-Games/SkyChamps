import { DB } from "../../deps.ts";
import type { Queries } from "./types.ts";

class Database {
  preparedQueries: Queries;
  database: DB = new DB("./database.db");

  constructor() {
    this.preparedQueries = {
      matches: {
        addMatch: this.database.prepareQuery(
          "INSERT INTO matches (match_id, started_at) VALUES (?, ?)",
        ),
        getMatchByID: this.database.prepareQuery(
          "SELECT (match_id, started_at) FROM matches WHERE match_id = ?",
        ),
      },
      matchPlayer: {
        addPlayer: this.database.prepareQuery(
          "INSERT INTO match_player (match_id, player_id, player_name) VALUES (?, ?, ?)",
        ),
        getPlayersByMatchID: this.database.prepareQuery(
          "SELECT (player_id, player_name) FROM match_player WHERE match_id = ?",
        ),
      },
      matchChatMessages: {
        addMessage: this.database.prepareQuery(
          "INSERT INTO match_chatmessages (date, message, player_id, match_id) VALUES (?, ?, ?, ?)",
        ),
        getMessagesByMatchID: this.database.prepareQuery(
          "SELECT (date, message, player_id) FROM match_chatmessages WHERE match_id = ?",
        ),
      },
      matchSpecialEvent: {
        addEvent: this.database.prepareQuery(
          "INSERT INTO match_special_event (date, event_data, player_id, match_id) VALUES (?, ?, ?, ?)",
        ),
        getEventsByMatchID: this.database.prepareQuery(
          "SELECT (date, event_data, player_id) FROM match_card_event WHERE match_id = ?",
        ),
      },
      matchCardEvent: {
        addEvent: this.database.prepareQuery(
          "INSERT INTO match_card_event (date, card_id, event_data, player_id, match_id) VALUES (?, ?, ?, ?, ?)",
        ),

        getEventsByMatchID: this.database.prepareQuery(
          "SELECT (date, card_id, event_data, player_id) FROM match_card_event WHERE match_id = ?",
        ),
      },
      cards: {
        getCardByID: this.database.prepareQuery(
          "SELECT (card_id, card_name, card_description, card_health, card_attack_damage, card_attack_name, card_ability_name, card_crit_chance) FROM cards WHERE card_id = ?",
        ),
        getCardByName: this.database.prepareQuery(
          "SELECT (card_id, card_name, card_description, card_health, card_attack_damage, card_attack_name, card_ability_name, card_crit_chance) FROM cards WHERE card_name = ?",
        ),
        getRandomCard: this.database.prepareQuery(
          "SELECT (card_id, card_name, card_description, card_health, card_attack_damage, card_attack_name, card_ability_name, card_crit_chance) FROM cards ORDER BY RANDOM() LIMIT = 1",
        ),
        getRandomCards: this.database.prepareQuery(
          "SELECT (card_id, card_name, card_description, card_health, card_attack_damage, card_attack_name, card_ability_name, card_crit_chance) FROM cards ORDER BY RANDOM() LIMIT = ?",
        ),
      },
    };
  }
}
