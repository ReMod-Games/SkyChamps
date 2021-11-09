import { logger } from "./logger.ts";

import type { LogFromWorker } from "../types/worker.ts";

export function startWorker(workerURL: URL, name: string) {
  logger.debug(`Worker "${name}" Starting!`);

  const worker = new Worker(workerURL, {
    name,
    type: "module",
    deno: {
      permissions: "inherit",
      namespace: true,
    },
  });

  worker.onmessage = (evt: MessageEvent<LogFromWorker>) => {
    logger.log(evt.data.logLevel, evt.data.message);
  };

  worker.onerror = (error) => {
    error.preventDefault();
    logger.critical(`Worker "${name}" has crashed!`);
    logger.critical(`Restarting "${name}" now!`);
    worker.terminate();
    startWorker(workerURL, name);
  };
}
