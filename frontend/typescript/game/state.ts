/// <reference lib="dom"/>
import type { CardJson } from "../../../types/card.ts";
import { createCard } from "./util.js";

interface Deck {
  parent: HTMLDivElement;
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
  private: {
    parent: HTMLDivElement;
    elements: HTMLDivElement[];
  };
  public: Deck;
}

class GameState {
  self: Self;
  opp: Opponent;

  constructor() {
    this.self = {
      private: {
        parent: document.getElementById("self_deck") as HTMLDivElement,
        cards: [],
        elements: [],
      },
      public: {
        parent: document.getElementById("self_played_deck") as HTMLDivElement,
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
      private: {
        parent: document.getElementById("opp_deck") as HTMLDivElement,
        elements: [],
      },
      public: {
        parent: document.getElementById("opp_played_deck") as HTMLDivElement,
        cards: [],
        elements: [],
      },
    };
  }

  addCard(
    player: "opp" | "self",
    deck: "public" | "private",
    index: number,
    card?: CardJson,
  ) {
    const div = createCard(card);
    div.onclick = () => {
      if (player === "opp" && deck !== "private") {
        this.self.selectors.opponent = index;
      } else if (player === "self") {
        this.self.selectors.self.type = deck;
        this.self.selectors.self.index = index;
      }
    };
    this[player][deck].elements[index] = div;
    this[player][deck].parent.appendChild(div);
    if (player === "self" || deck === "public") {
      (this[player][deck] as Deck).cards[index] = card!;
    }
  }

  removeCard(
    player: "opp" | "self",
    deck: "public" | "private",
    index: number,
  ) {
    const div = this[player][deck].elements[index];
    div.onclick = null;
    div.remove();
    if (player === "self" || deck === "public") {
      delete (this[player][deck] as Deck).cards[index];
    }
  }
  getCard(player: "opp", deck: "public", index: number): CardJson;
  getCard(player: "self", deck: "public" | "private", index: number): CardJson;
  getCard(
    player: "opp" | "self",
    deck: "public" | "private",
    index: number,
  ): CardJson | undefined {
    if (player === "opp" && deck === "private") return;
    return (this[player][deck] as Deck).cards[index];
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
