/// <reference lib="dom"/>
import type { CardJson } from "../../../types/card.ts";

type Player = "opp" | "self";
type CardJsonExt = Element & CardJson;
type ModifyFunction = (card: CardJsonExt) => void;

interface Element {
  element: HTMLDivElement;
}

interface Self {
  privateDeck: CardJsonExt[];
  publicDeck: CardJsonExt[];
}

interface Opp {
  privateDeck: Element[];
  publicDeck: CardJsonExt[];
}

export class GameState {
  self: Self;
  opp: Opp;

  constructor() {
    this.self = {
      privateDeck: [],
      publicDeck: [],
    };

    this.opp = {
      privateDeck: [],
      publicDeck: [],
    };
  }

  addCard(player: "opp", index: number, card: undefined): void;
  addCard(player: "self", index: number, card: CardJson): void;
  addCard(player: Player, index: number, card?: CardJson): void {
    const deck = this[player].privateDeck;
    const element = document.createElement("div");
    let className = "card";
    if (card) className += ` ${card.name}`;
    element.className = className;
    deck[index] = { element, ...card };

    // Get private deck div and add `element` to it
    // Play draw animation of `element`
  }

  removeCard(player: Player, cardIndex: number): void {
    const _element = this[player].publicDeck[cardIndex].element;
    delete this[player].publicDeck[cardIndex];

    // Get public deck div and remove `element` from it;
    // Play delete animation of `element`
  }

  moveCard(player: "opp", index: number, card: CardJson): void;
  moveCard(player: "self", index: number, card: undefined): void;
  moveCard(player: Player, index: number, card?: CardJson): void {
    const { publicDeck, privateDeck } = this[player];
    const element = privateDeck[index].element;

    publicDeck[index] =
      (player === "self"
        ? privateDeck[index]
        : { element, ...card }) as CardJsonExt;

    // Play move animation of `element`
    delete privateDeck[index];
  }

  modifyCard(
    player: Player,
    cardIndex: number,
    modifier: ModifyFunction,
  ): boolean {
    const card = this[player].publicDeck[cardIndex];
    if (!card) return false;
    modifier(card);
    return true;
  }
}
