import { requires, run } from "./_util.ts";

export default async function install() {
  await requires("git");

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
