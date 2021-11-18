import { swcTransform } from "../deps.ts";
import { log } from "./worker_logger.ts";

const encoder = new TextEncoder();

export async function compile(
  base: string,
  entry: Deno.DirEntry,
): Promise<Uint8Array> {
  log(20, `Reading ${entry.name}`);
  const tsCode = await Deno.readTextFile(base + entry.name);
  log(20, `Transforming ${entry.name}`);
  const transpiled = swcTransform(tsCode, {
    // @ts-ignore: Typings are fucked...
    minify: true,
    jsc: {
      target: "es2020",
      parser: {
        syntax: "typescript",
      },
    },
  }).code;

  log(20, `Encoding ${entry.name}`);
  return encoder.encode(transpiled);
}
