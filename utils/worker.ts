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
    if (
      error.error === null && error.filename === "" && error.lineno === 0 &&
      error.type === "error" && error.colno === 0
    ) {
      worker.terminate();
      return;
    }

    error.preventDefault();
    logger.critical(`Worker "${name}" has crashed!`);
    logger.critical(`Worker Crashed on: "${error.error}"`);
    logger.critical(`Occured on: ${error.filename}|${error.lineno}`);
    logger.critical(`Restarting "${name}" now!`);
    worker.terminate();
    startWorker(workerURL, name);
  };
}
