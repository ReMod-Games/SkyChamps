export * as Misc from "./misc.ts";
export * as Game from "./game.ts";

import type { AnyMiscEvent } from "./misc.ts";
import type { AnyGameEvent } from "./game.ts";

export type AnyClientEvent = AnyMiscEvent | AnyGameEvent;
