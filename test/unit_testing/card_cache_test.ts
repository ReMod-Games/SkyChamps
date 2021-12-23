import { assertEquals, assertNotEquals } from "../test_deps.ts";
import { CardCache } from "../../utils/cards/cards_cache.ts";

const CARD_CACHE = new CardCache(
  JSON.parse(await Deno.readTextFile("./cards.json")),
);

Deno.test({
  name: "cache test",
  fn() {
    const f = CARD_CACHE.getCard(0)!;
    const f2 = CARD_CACHE.getCard(0)!;

    f.health = 0;
    (f.name as string) = "ree";
    assertEquals(f2.health, 100);
    assertNotEquals(f.name, f2.name);
    assertEquals(f.name, "ree");
  },
});
