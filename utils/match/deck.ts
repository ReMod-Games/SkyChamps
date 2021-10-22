import type { Card } from "../cards/cards_cache.ts";

type ModifiableKeys = "critChance" | "attackDamage" | "health" | "critFactor";

export class Deck {
  declare private innerDeck: Card[];

  addCard(card: Card): number {
    // Note: This may need changes depending on client code.
    const possibleIndex = this.innerDeck.findIndex((x) => x === undefined);
    const index = possibleIndex > 0 ? possibleIndex : this.innerDeck.length;
    this.innerDeck[index] = card;
    return index;
  }

  removeCard(cardIndex: number): void {
    delete this.innerDeck[cardIndex];
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

  /**
   * Works as a destructor.
   *
   * Clears up deck
   */
  cleanUp() {
    this.innerDeck = [];
  }
}
