import type { CardJson } from "../../types/card.ts";

type Action = (card: Card) => void | PromiseLike<void>;

export class Card {
  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly attackName: string;
  public readonly abilityName: string;
  public health: number;
  public attackDamage: number;
  public critFactor: number;
  public critChance: number;

  private turnTable: Map<number, Map<number, Action>>;

  constructor(card: CardJson) {
    this.id = card.id;
    this.name = card.name;
    this.description = card.description;
    this.attackName = card.attackName;
    this.abilityName = card.abilityName;
    this.health = card.health;
    this.attackDamage = card.attackDamage;
    this.critFactor = card.critFactor;
    this.critChance = card.critChance;

    this.turnTable = new Map();
  }

  addActionToTurn(turn: number, action: Action): void {
    if (!this.turnTable.has(turn)) this.turnTable.set(turn, new Map());
    const table = this.turnTable.get(turn)!;
    table.set(table.size, action);
  }

  executeTurnActions(turn: number) {
    const actions = this.turnTable.get(turn)?.values();
    if (!actions) return;

    for (const action of actions) {
      action(this);
    }

    this.turnTable.delete(turn);
  }

  cleanUp() {
    this.turnTable = new Map();
  }
}
