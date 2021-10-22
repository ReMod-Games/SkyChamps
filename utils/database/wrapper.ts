import { DB } from "../../deps.ts";
import type {
  CardEventRecord,
  EventData,
  MatchID,
  MatchRecord,
  Message,
  MessageRecord,
  PlayerID,
  PlayerName,
  PlayerRecord,
  Queries,
  SpecialEventRecord,
} from "./types.ts";

class Database {
  declare preparedQueries: Queries;
  declare database: DB;

  constructor() {
    this.database = new DB("./database.db");

    this.database.query(
      "CREATE TABLE IF NOT EXISTS matches (match_id VARCHAR(8), started_at TEXT)",
    );
    this.database.query(
      "CREATE TABLE IF NOT EXISTS match_player (FOREIGN KEY(match_id) REFERENCES matches(match_id), player_id INTEGER, player_name TEXT)",
    );
    this.database.query(
      "CREATE TABLE IF NOT EXISTS match_chatmessages (date TEXT, message TEXT, FOREIGN KEY(player_id) REFERENCES match_player(player_id), FOREIGN KEY(match_id) REFERENCES matches(match_id))",
    );
    this.database.query(
      "CREATE TABLE IF NOT EXISTS match_special_event (date TEXT, event_data TEXT, FOREIGN KEY(player_id) REFERENCES match_player(player_id), FOREIGN KEY(match_id) REFERENCES matches(match_id))",
    );
    this.database.query(
      "CREATE TABLE IF NOT EXISTS match_card_event (date TEXT, event_data TEXT, FOREIGN KEY(card_id) REFERENCES cards(card_id), FOREIGN KEY(player_id) REFERENCES match_player(player_id), FOREIGN KEY(match_id) REFERENCES matches(match_id))",
    );
    // Create all queries needed for database
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
    };
  }

  addMatch(matchID: MatchID): void {
    this.preparedQueries.matches.addMatch
      .execute([
        matchID,
        new Date().toString(),
      ]);
  }

  getMatchByID(matchID: MatchID): MatchRecord {
    return this.preparedQueries.matches.getMatchByID
      .oneEntry([
        matchID,
      ]);
  }

  addPlayer(
    matchID: MatchID,
    playerID: PlayerID,
    playerName: PlayerName,
  ): void {
    this.preparedQueries.matchPlayer.addPlayer
      .execute([
        matchID,
        playerID,
        playerName,
      ]);
  }

  getPlayersByMatchID(matchID: MatchID): PlayerRecord {
    return this.preparedQueries.matchPlayer.getPlayersByMatchID
      .oneEntry([
        matchID,
      ]);
  }

  addMessage(message: Message, playerID: PlayerID, matchID: MatchID) {
    this.preparedQueries.matchChatMessages.addMessage
      .execute([
        new Date().toString(),
        message,
        playerID,
        matchID,
      ]);
  }

  getMessagesByMatchID(matchID: MatchID): MessageRecord[] {
    return this.preparedQueries.matchChatMessages.getMessagesByMatchID
      .allEntries([
        matchID,
      ]);
  }

  addSpecialEvent(
    eventData: EventData,
    playerID: PlayerID,
    matchID: MatchID,
  ): void {
    this.preparedQueries.matchSpecialEvent.addEvent.execute([
      new Date().toString(),
      eventData,
      playerID,
      matchID,
    ]);
  }

  getSpecialEventsByMatchID(matchID: MatchID): SpecialEventRecord[] {
    return this.preparedQueries.matchSpecialEvent.getEventsByMatchID
      .allEntries([
        matchID,
      ]);
  }

  addCardEvent(
    cardID: number,
    eventData: EventData,
    playerID: PlayerID,
    matchID: MatchID,
  ): void {
    this.preparedQueries.matchCardEvent.addEvent
      .execute([
        new Date().toString(),
        cardID,
        eventData,
        playerID,
        matchID,
      ]);
  }

  getCardEventsByMatchID(matchID: MatchID): CardEventRecord[] {
    return this.preparedQueries.matchCardEvent.getEventsByMatchID
      .allEntries([
        matchID,
      ]);
  }
}

const database = new Database();

export { database };
