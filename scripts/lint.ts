import { requires, run } from "./_util.ts";

export default async function lint() {
  await requires("npx", "deno");

  await run("deno", "lint", "--ignore=web-client", "./");
  Deno.chdir("./web-client");
  await run("npx", "eslint", ".");
}

if (import.meta.main) await lint();
