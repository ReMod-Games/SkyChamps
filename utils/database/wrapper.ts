import { DB } from "../../deps.ts";
import type { Queries } from "./types.ts";

class Database {
  preparedQueries: Queries;
  database: DB = new DB("./database.db");

  constructor() {
    this.preparedQueries = {
      matches: {
        // deno-fmt-ignore
        addMatch: this.database.prepareQuery("INSERT INTO matches (match_id, started_at) VALUES (?, ?)"),
        // deno-fmt-ignore
        getMatchByID: this.database.prepareQuery("SELECT (match_id, started_at) FROM matches WHERE match_id = ?"),
      },
      matchPlayer: {
        // deno-fmt-ignore
        addPlayer: this.database.prepareQuery("INSERT INTO match_player (match_id, player_id, player_name) VALUES (?, ?, ?)"),
        // deno-fmt-ignore
        getPlayersByMatchID: this.database.prepareQuery("SELECT (player_id, player_name) FROM match_player WHERE match_id = ?"),
      },
      matchChatMessages: {
        // deno-fmt-ignore
        addMessage: this.database.prepareQuery("INSERT INTO match_chatmessages (date, message, player_id, match_id) VALUES (?, ?, ?, ?)"),
        // deno-fmt-ignore
        getMessagesByMatchID: this.database.prepareQuery("SELECT (date, message, player_id) FROM match_chatmessages WHERE match_id = ?"),
      },
      matchSpecialEvent: {
        // deno-fmt-ignore
        addEvent: this.database.prepareQuery("INSERT INTO match_special_event (date, event_data, player_id, match_id) VALUES (?, ?, ?, ?)"),
        // deno-fmt-ignore
        getEventsByMatchID: this.database.prepareQuery("SELECT (date, event_data, player_id) FROM match_card_event WHERE match_id = ?"),
      },
      matchCardEvent: {
        // deno-fmt-ignore
        addEvent: this.database.prepareQuery("INSERT INTO match_card_event (date, card_id, event_data, player_id, match_id) VALUES (?, ?, ?, ?, ?)"),
        // deno-fmt-ignore
        getEventsByMatchID: this.database.prepareQuery("SELECT (date, card_id, event_data, player_id) FROM match_card_event WHERE match_id = ?"),
      },
      cards: {
        // deno-fmt-ignore
        getCardByID: this.database.prepareQuery("SELECT (card_id, card_name, card_description, card_health, card_attack_damage, card_attack_name, card_ability_name, card_crit_chance) FROM cards WHERE card_id = ?"),
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
