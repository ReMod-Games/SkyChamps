import type { Level } from "../deps.ts";

export interface LogFromWorker {
  logLevel: Level;
  message: string;
}
