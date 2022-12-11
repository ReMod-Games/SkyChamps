import { requires, run } from "./_util.ts";

export default async function format() {
  await requires("npx", "deno");

  await run("deno", "fmt", "--ignore=web-client", "./");
  Deno.chdir("./web-client");
  await run("npx", "prettier", "-w", "./");
}

if (import.meta.main) await format();
