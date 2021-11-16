import { swcTransform } from "../deps.ts";
import { logger } from "./logger.ts";

const encoder = new TextEncoder();

export function compile(base: string, entry: Deno.DirEntry): Uint8Array {
  logger.debug(`Reading ${entry.name}`);
  const tsCode = Deno.readTextFileSync(base + entry.name);
  logger.debug(`Parsing, Tranforming & Encoding ${entry.name}`);
  return encoder.encode(
    swcTransform(tsCode, {
      // @ts-ignore: Typings are fucked...
      minify: true,
      jsc: {
        target: "es2020",
        parser: {
          syntax: "typescript",
        },
      },
    }).code,
  );
}
