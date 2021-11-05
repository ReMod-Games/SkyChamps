import { logger } from "./logger.ts";

export function startWorker(workerURL: URL, options: WorkerOptions) {
  const worker = new Worker(workerURL, options);
  worker.onerror = (error) => {
    error.preventDefault();
    logger.critical(`Worker "${options.name}" has crashed!`);
    logger.critical(`Restarting "${options.name}" now!`);
    startWorker(workerURL, options);
  };
}
