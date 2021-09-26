import type { CardRecord } from "../database/types.ts";

export class GameState {
  playerOneDeck: CardRecord[];
  playerTwoDeck: CardRecord[];

  constructor() {
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }

  addCard(playerID: 0 | 1, card: CardRecord): number {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    const possibleIndex = deck.findIndex((x) => x === undefined);
    const index = possibleIndex > 0 ? possibleIndex : deck.length;
    deck[index] = card;
    return index;
  }

  removeCard(playerID: 0 | 1, cardIndex: number): void {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    delete deck[cardIndex];
  }

  changeCard(
    playerID: 0 | 1,
    cardIndex: number,
    key: "card_crit_chance" | "card_attack_dmg" | "card_health",
    value: CardRecord[typeof key],
  ): boolean {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    const card = deck[cardIndex];
    if (!card) return false;

    card[key] = value;
    return true;
  }

  getCard(playerID: 0 | 1, cardIndex: number): CardRecord | undefined {
    const deck = playerID === 0 ? this.playerOneDeck : this.playerTwoDeck;
    return deck[cardIndex];
  }

  cleanUp(): void {
    this.playerOneDeck = [];
    this.playerTwoDeck = [];
  }
}
