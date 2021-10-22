import { Deck } from "./deck.ts";

export class GameState {
  declare turn: number;
  // These deck's are already played
  // Should be visible to all players
  declare playerOneDeck: Deck;
  declare playerTwoDeck: Deck;

  constructor() {
    this.turn = 0;
    this.playerOneDeck = new Deck();
    this.playerTwoDeck = new Deck();
  }

  cleanUp(): void {
    this.playerOneDeck.cleanUp();
    this.playerTwoDeck.cleanUp();
  }
}
