export * as OppEvents from "./opponent.ts";
export * as SelfEvents from "./self.ts";
export * as MiscEvents from "./misc.ts";

import type { AnyMiscEvent } from "./misc.ts";
import type { AnyOppEvent } from "./opponent.ts";
import type { AnySelfEvent } from "./self.ts";

export type AnyServerEvent = AnyMiscEvent | AnyOppEvent | AnySelfEvent;
