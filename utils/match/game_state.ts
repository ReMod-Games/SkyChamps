import { Deck } from "./deck.ts";

export class GameState {
  public turn: number;
  // These deck's are already played
  // Should be visible to all players
  public playerDecks: Deck[];
  constructor() {
    this.turn = 0;
    this.playerDecks = [new Deck(), new Deck()];
  }

  nextTurn() {
    for (const deck of this.playerDecks) {
      for (const card of deck) {
        card.executeTurnActions(this.turn);
      }
    }

    this.turn++;
  }

  cleanUp(): void {
    this.playerDecks[0].cleanUp();
    this.playerDecks[1].cleanUp();
  }
}
