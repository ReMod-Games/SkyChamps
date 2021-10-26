import type { Card } from "../cards/card.ts";

type ModifiableKeys = "critChance" | "attackDamage" | "health" | "critFactor";

export class Deck {
  private innerDeck: Card[];

  constructor() {
    this.innerDeck = [];
  }

  addCard(card: Card): number {
    // Note: This may need changes depending on client code.
    const possibleIndex = this.innerDeck.findIndex((x) => x === undefined);
    const index = possibleIndex > 0 ? possibleIndex : this.innerDeck.length;
    this.innerDeck[index] = card;
    return index;
  }

  removeCard(cardIndex: number): void {
    const card = this.innerDeck[cardIndex];
    if (!card) return;
    card.cleanUp();
    delete this.innerDeck[cardIndex];
  }

  moveCard(cardIndex: number): Card | undefined {
    const card = this.innerDeck[cardIndex];
    if (!card) return;
    delete this.innerDeck[cardIndex];

    return card;
  }

  modifyCard(
    cardIndex: number,
    key: ModifiableKeys,
    value: Card[typeof key],
  ): boolean {
    const card = this.innerDeck[cardIndex];
    if (!card) return false;

    card[key] = value;
    return true;
  }

  getCard(cardIndex: number): Card | undefined {
    return this.innerDeck[cardIndex];
  }

  getDeck(): Card[] {
    return this.innerDeck;
  }

  [Symbol.iterator](): Iterator<Card> {
    let i = 0;
    return {
      next: () => {
        if (i < this.innerDeck.length - 1) {
          const card = this.innerDeck[i];
          i++;
          return { value: card, done: false };
        }
        return { value: this.innerDeck[i], done: true };
      },
    };
  }

  /**
   * Works as a destructor.
   *
   * Clears up deck
   */
  cleanUp() {
    this.innerDeck.forEach((x) => x.cleanUp());
    this.innerDeck = [];
  }
}
