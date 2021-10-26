export * as Opp from "./opponent.ts";
export * as Self from "./self.ts";
export * as Misc from "./misc.ts";

import type { AnyMiscEvent } from "./misc.ts";
import type { AnyOppEvent } from "./opponent.ts";
import type { AnySelfEvent } from "./self.ts";

export type AnyClientEvent = AnyMiscEvent | AnyOppEvent | AnySelfEvent;
