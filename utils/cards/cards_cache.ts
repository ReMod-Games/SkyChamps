import { Card } from "./card.ts";

import type { CardJson } from "./card.ts";

class CardCache {
  declare private innerMap: Map<number, Card>;

  constructor(cards: Card[]) {
    for (const card of cards) this.innerMap.set(card.id, card);
  }

  getCard(id: number): Card | undefined {
    return this.innerMap.get(id);
  }

  getRandomCard(): Card {
    const id = Math.floor(Math.random() * this.innerMap.size) + 1;
    return this.innerMap.get(id)!;
  }
}

export const cardCache = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")).map((x: CardJson) =>
    new Card(x)
  ),
);
