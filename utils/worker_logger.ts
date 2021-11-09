import type { Context, Level } from "../deps.ts";
import type { LogFromWorker } from "../types/worker.ts";

export function log(logLevel: Level, message: string) {
  (self as unknown as Worker).postMessage(
    { logLevel, message } as LogFromWorker,
  );
}

export function tracker(ctx: Context) {
  (self as unknown as Worker).postMessage({
    logLevel: 30,
    message:
      `new ${ctx.request.method} from ${ctx.request.ip} to ${ctx.request.url}`,
  } as LogFromWorker);
}
