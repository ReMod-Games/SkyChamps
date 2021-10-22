import type { Card } from "../cards/cards_cache.ts";

export class GameState {
  declare turn: number;
  // These deck's are already played
  // Should be visible to all players
  declare playerOneDeck: Card[];
  declare playerTwoDeck: Card[];

  constructor() {
    this.turn = 0;
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }

  cleanUp(): void {
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }
}
