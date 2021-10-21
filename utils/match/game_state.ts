import type { CardRecord as Card } from "../database/types.ts";

type ModifiableKeys = "card_crit_chance" | "card_attack_dmg" | "card_health";
export class GameState {
  // These deck's are already played
  // Should be visible to all players
  declare playerOneDeck: Card[];
  declare playerTwoDeck: Card[];

  constructor() {
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }

  addCard(playerID: 0 | 1, card: Card): number {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    // Note: This may need changes depending on client code.
    const possibleIndex = deck.findIndex((x) => x === undefined);
    const index = possibleIndex > 0 ? possibleIndex : deck.length;
    deck[index] = card;
    return index;
  }

  removeCard(playerID: 0 | 1, cardIndex: number): void {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    delete deck[cardIndex];
  }

  modifyCard(
    playerID: 0 | 1,
    cardIndex: number,
    key: ModifiableKeys,
    value: Card[typeof key],
  ): boolean {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    const card = deck[cardIndex];
    if (!card) return false;

    card[key] = value;
    return true;
  }

  getCard(playerID: 0 | 1, cardIndex: number): Card | undefined {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    return deck[cardIndex];
  }

  cleanUp(): void {
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }
}
