import { Deck } from "./deck.ts";

export class GameState {
  public turn: number;
  // These deck's are already played
  // Should be visible to all players
  public playerOneDeck: Deck;
  public playerTwoDeck: Deck;

  constructor() {
    this.turn = 0;
    this.playerOneDeck = new Deck();
    this.playerTwoDeck = new Deck();
  }

  nextTurn() {
    for (const card of this.playerOneDeck) {
      card.executeTurnActions(this.turn);
    }
    for (const card of this.playerTwoDeck) {
      card.executeTurnActions(this.turn);
    }

    this.turn++;
  }

  cleanUp(): void {
    this.playerOneDeck.cleanUp();
    this.playerTwoDeck.cleanUp();
  }
}
