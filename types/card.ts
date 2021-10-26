export interface CardJson {
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
