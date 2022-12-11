import { requires, run } from "./_util.ts";

const COPY_COMMAND = Deno.build.os === "windows" ? "Copy-Item" : "cp";

export default async function build() {
  await requires("npx", COPY_COMMAND);

  // Go into web client directory
  Deno.chdir("./web-client");

  // Build files
  await run("npx", "vite", "build");

  // Move back to root of repo
  Deno.chdir("../");

  const command = Deno.build.os === "windows"
    ? ["-Destination", "http/dist"]
    : ["http/dist"];

  await run(COPY_COMMAND, "web-client/dist", ...command);
}

if (import.meta.main) await build();
