import type { Card } from "../utils/cards/card.ts";

type ModifyFunction = (card: Card) => void;

export class Deck {
  private innerDeck: Card[];
  private maxCards: number;

  get length() {
    return this.innerDeck.length;
  }

  constructor(maxCards: number) {
    this.innerDeck = [];
    this.maxCards = maxCards;
  }

  addCard(card: Card): number | undefined {
    // Note: This may need changes depending on client code.
    const possibleIndex = this.innerDeck.findIndex((x) => x === undefined);
    const index = possibleIndex >= 0 ? possibleIndex : this.innerDeck.length;
    if (index > this.maxCards) return;
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
