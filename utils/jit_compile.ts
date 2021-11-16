import { swcParse, swcPrint } from "../deps.ts";
import { logger } from "./logger.ts";

const encoder = new TextEncoder();

export function compile(base: string, entry: Deno.DirEntry): Uint8Array {
  logger.debug(`Reading ${entry.name}`);
  const tsCode = Deno.readTextFileSync(base + entry.name);
  logger.debug(`Parsing ${entry.name}`);
  const ast = swcParse(
    tsCode,
    {
      syntax: "typescript",
      comments: false,
      target: "es2020",
    },
  );
  logger.debug(`Printing & Encoding ${entry.name}`);

  return encoder.encode(
    swcPrint(ast, {
      minify: true,
      jsc: {
        target: "es2020",
      },
    }).code,
  );
}
