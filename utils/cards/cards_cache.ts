export interface Card {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly attackName: string;
  readonly abilityName: string;
  health: number;
  attackDamage: number;
  critFactor: number;
  critChance: number;
}

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
  JSON.parse(await Deno.readTextFile("./cards.json")),
);
