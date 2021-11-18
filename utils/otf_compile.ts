import { swcTransform } from "../deps.ts";
import { log } from "./worker_logger.ts";

const encoder = new TextEncoder();

export async function compile(
  path: string,
  name: string,
): Promise<Uint8Array> {
  log(20, `Reading ${name}`);
  const tsCode = await Deno.readTextFile(path);
  log(20, `Transforming ${name}`);
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

  log(20, `Encoding ${name}`);
  return encoder.encode(transpiled);
}
