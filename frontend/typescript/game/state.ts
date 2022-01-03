/// <reference lib="dom"/>
import type { CardJson } from "../../../types/card.ts";
import { createCard } from "./util.js";

interface Deck {
  cards: CardJson[];
  elements: HTMLDivElement[];
}

interface Self {
  private: Deck;
  public: Deck;
  selectors: {
    opponent: number | null;
    self: {
      type: "private" | "public" | null;
      index: number | null;
    };
  };
}

interface Opponent {
  private: HTMLDivElement[];
  public: Deck;
}

class GameState {
  self: Self;
  opp: Opponent;

  constructor() {
    this.self = {
      private: {
        cards: [],
        elements: [],
      },
      public: {
        cards: [],
        elements: [],
      },
      selectors: {
        opponent: null,
        self: {
          type: null,
          index: null,
        },
      },
    };

    this.opp = {
      private: [],
      public: {
        cards: [],
        elements: [],
      },
    };
  }

  addCardPublicDeck(player: "opp" | "self", index: number, card: CardJson) {
    const div = createCard(card);
    this[player].public.elements[index] = div;
    this[player].public.cards[index] = card;
  }

  addCardPrivateDeck(player: "opp", index: number): void;
  addCardPrivateDeck(player: "self", index: number, card: CardJson): void;
  addCardPrivateDeck(player: "opp" | "self", index: number, card?: CardJson) {
    const div = createCard(card);
    if (player === "opp") {
      this.opp.private[index] = div;
    } else {
      this.self.private.elements[index] = div;
      this.self.private.cards[index] = card!;
    }
  }

  removeCardPublicDeck(player: "opp" | "self", index: number) {
    const { cards, elements } = this[player].public;
    const res = document.removeChild(elements[index]);
    console.log({ childRemoved: res, player, index });
    delete elements[index];
    delete cards[index];
  }

  removeCardPrivateDeck(player: "opp" | "self", index: number) {
    if (player === "opp") {
      const elem = this.opp.private[index];
      const res = document.removeChild(elem);
      console.log({ childRemoved: res, player, index });
      delete this.opp.private[index];
    } else {
      const { cards, elements } = this[player].private;
      const res = document.removeChild(elements[index]);
      console.log({ childRemoved: res, player, index });
      delete elements[index];
      delete cards[index];
    }
  }

  getCardPublicDeck(player: "opp" | "self", index: number): CardJson {
    return this[player].public.cards[index];
  }

  /**
   * Can only be self
   */
  getCardPrivateDeck(index: number): CardJson {
    return this.self.private.cards[index];
  }

  modifyCard(
    player: "opp" | "self",
    index: number,
    cb: (card: CardJson) => void,
  ) {
    const card = this[player].public.cards[index];
    cb(card);
    if (card.health <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

export const GAME_STATE = new GameState();
