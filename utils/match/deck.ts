import type { Card } from "../cards/card.ts";

type ModifyFunction = (card: Card) => void;

export class Deck {
  private innerDeck: Card[];

  get length() {
    return this.innerDeck.length;
  }

  constructor(maxCards: number) {
    this.innerDeck = new Array(maxCards);
  }

  addCard(card: Card): number {
    // Note: This may need changes depending on client code.
    const possibleIndex = this.innerDeck.findIndex((x) => x === undefined);
    const index = possibleIndex >= 0 ? possibleIndex : this.innerDeck.length;
    this.innerDeck[index] = card;
    return index;
  }

  removeCard(cardIndex: number): boolean {
    const card = this.innerDeck[cardIndex];
    if (!card) return false;
    card.cleanUp();
    delete this.innerDeck[cardIndex];
    return true;
  }

  moveCard(cardIndex: number): Card | undefined {
    const card = this.innerDeck[cardIndex];
    if (!card) return;
    delete this.innerDeck[cardIndex];

    return card;
  }

  modifyCard(
    cardIndex: number,
    modifier: ModifyFunction,
  ): boolean {
    const card = this.innerDeck[cardIndex];
    if (!card) return false;
    modifier(card);
    return true;
  }

  getCard(cardIndex: number): Card | undefined {
    return this.innerDeck[cardIndex];
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
