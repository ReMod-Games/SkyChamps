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

export const cardCache: Map<number, Card> = new Map();

{
  const jsonData: Card[] = JSON.parse(await Deno.readTextFile("./cards.json"));
  for (const card of jsonData) cardCache.set(card.id, card);
}
