import { logger } from "./logger.ts";

export function startWorker(workerURL: URL, options: WorkerOptions) {
  const w = new Worker(workerURL, options);
  w.onerror = () => {
    logger.critical(`Worker "${options.name}" has crashed!`);
    logger.critical(`Restarting "${options.name}" now!`);
    startWorker(workerURL, options);
  };
}
