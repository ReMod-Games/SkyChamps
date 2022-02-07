import { Deck } from "../../match/deck.ts";
import { assert, assertEquals } from "../test_deps.ts";
import { CardCache } from "../../utils/cards/cards_cache.ts";

const CARD_CACHE = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")),
);

Deno.test({
  name: "Deck function addCard",
  fn() {
    const deck = new Deck(5);
    const firstIndex = deck.addCard(CARD_CACHE.getRandomCard());
    const secondIndex = deck.addCard(CARD_CACHE.getRandomCard());
    deck.removeCard(0);
    const thirdIndex = deck.addCard(CARD_CACHE.getRandomCard());
    assertEquals(firstIndex, 0);
    assertEquals(secondIndex, 1);
    assertEquals(thirdIndex, 0);
  },
  sanitizeExit: true,
  sanitizeOps: true,
  sanitizeResources: true,
});

Deno.test({
  name: "Deck function removeCard",
  fn() {
    const deck = new Deck(5);
    deck.addCard(CARD_CACHE.getRandomCard());
    const validIndex = deck.removeCard(0);
    const invalidIndex = deck.removeCard(0);
    assert(validIndex);
    assert(!invalidIndex);
  },
  sanitizeExit: true,
  sanitizeOps: true,
  sanitizeResources: true,
});
