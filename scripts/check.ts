import { requires, run } from "./_util.ts";

export default async function check() {
  await requires("npx", "deno");

  // await run("deno", "check", "./game-server/main.ts");
  // await run("deno", "check", "./http/main.ts");
  Deno.chdir("./web-client");
  await run("npx", "vue-tsc", "--noEmit");
}

if (import.meta.main) await check();
