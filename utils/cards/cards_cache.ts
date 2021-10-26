import { Card } from "./card.ts";

import type { CardJson } from "../../types/card.ts";

class CardCache {
  private innerMap: Map<number, Card>;

  constructor(cards: CardJson[]) {
    this.innerMap = new Map(cards.map((x, i) => [i, new Card(x)]));
  }

  getCard(id: number): Card | undefined {
    return this.innerMap.get(id);
  }

  getRandomCard(): Card {
    const id = Math.floor(Math.random() * this.innerMap.size);
    return this.innerMap.get(id)!;
  }
}

export const cardCache = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")),
);
