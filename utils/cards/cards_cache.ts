import { Card } from "./card.ts";

import type { CardJson } from "../../types/card.ts";

export class CardCache {
  private innerMap: Map<number, Card>;

  constructor(cards: CardJson[]) {
    this.innerMap = new Map(cards.map((x, i) => [i, new Card(x)]));
  }

  getCard(id: number): Card | undefined {
    const maybeCard = this.innerMap.get(id);
    if (!maybeCard) return;
    return new Card(maybeCard);
  }

  getRandomCard(): Card {
    const id = Math.floor(Math.random() * this.innerMap.size);
    return new Card(this.innerMap.get(id)!);
  }
}

export const CARD_CACHE: CardCache = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")),
);
