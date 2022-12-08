import { requires, run } from "./_util.ts";

export async function install() {
  if (!await requires("git")) {
    console.error("Missing any of the following shell commands: [git]");
    Deno.exit(1);
  }

  await run("git", "clone", "https://github.com/remod-games/skychamps.git");
  Deno.chdir("./skychamps");

  const CONFIG_BASE = {
    http: {
      certFile: "",
      port: 80,
    },
    gameserver: {
      certFile: "",
      port: 800,
    },
  };

  await Deno.writeTextFile(
    "./config.json.example",
    JSON.stringify(CONFIG_BASE, undefined, 2),
  );
}

if (import.meta.main) await install();
