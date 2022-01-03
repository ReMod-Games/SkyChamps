/// <reference lib="dom"/>
import type { CardJson } from "../../../types/card.ts";
import { createCard } from "./util.js";
type Player = "opp" | "self";
type CardJsonExt = Element & CardJson;
type ModifyFunction = (card: CardJsonExt) => void;

interface Element {
  element: HTMLDivElement;
}

interface Self {
  privateDeck: CardJsonExt[];
  publicDeck: CardJsonExt[];
  element: HTMLDivElement;
}

interface Opp {
  privateDeck: Element[];
  publicDeck: CardJsonExt[];
  element: HTMLDivElement;
}

interface SelectedCard {
  type: null | "private" | "public";
  index: null | number;
}

interface SelectedCards {
  opp: SelectedCard;
  self: SelectedCard;
}

export class GameState {
  self: Self;
  opp: Opp;
  selectedCards: SelectedCards;
  constructor() {
    this.self = {
      privateDeck: [],
      publicDeck: [],
      element: null as unknown as HTMLDivElement,
    };

    this.opp = {
      privateDeck: [],
      publicDeck: [],
      element: null as unknown as HTMLDivElement,
    };

    this.selectedCards = {
      opp: { type: null, index: null },
      self: { type: null, index: null },
    };
  }

  addCard(id: "opp", index: number): void;
  addCard(id: "self", index: number, card: CardJson): void;
  addCard(id: Player, index: number, card?: CardJson): void {
    const player = this[id];
    const element = createCard(card);
    player.element.appendChild(element);
    player.privateDeck[index] = { element, ...card };

    element.onclick = () => this.selectedCards[id] = { type: "private", index };
    // Play draw animation of `element`
  }

  removeCard(player: Player, cardIndex: number): void {
    const element = this[player].publicDeck[cardIndex].element;
    delete this[player].publicDeck[cardIndex];
    element.onclick = null;
    document.removeChild(element);
    // Play delete animation of `element`
  }

  moveCard(id: "opp", index: number, card: CardJson): void;
  moveCard(id: "self", index: number): void;
  moveCard(id: Player, index: number, card?: CardJson): void {
    const { publicDeck, privateDeck } = this[id];
    let { element } = privateDeck[index];
    if (id === "opp") {
      document.removeChild(element);
      element = createCard(card);
    }
    element.onclick = () => this.selectedCards[id] = { type: "public", index };
    publicDeck[index] =
      (id === "self"
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

  getCard(player: Player, index: number): CardJsonExt {
    return this[player].publicDeck[index];
  }
}

export const GAME_STATE = new GameState();
