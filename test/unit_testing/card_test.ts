import { assert, assertEquals } from "../test_deps.ts";
import { CardCache } from "../../utils/cards/cards_cache.ts";

const CARD_CACHE = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")),
);

Deno.test({
  name: "Card test",
  fn() {
    const f = CARD_CACHE.getCard(0)!;
    f.addActionToTurn(1, (card) => {
      card.health = 10;
    });
    f.addActionToTurn(2, (card) => {
      card.health = 0;
    });
    assertEquals(f.health, 100);
    const invalid = f.executeTurnActions(0);
    const isDead = f.executeTurnActions(1);
    const isDead2 = f.executeTurnActions(2);

    assertEquals(f.health, 0);
    assertEquals(invalid, undefined);
    assert(!isDead);
    assert(isDead2);
  },
});
