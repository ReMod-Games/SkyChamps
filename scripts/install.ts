import build from "./build.ts";
import { requires, run } from "./_util.ts";

export default async function install() {
  await requires("git");

  await run("git", "clone", "https://github.com/remod-games/skychamps.git");

  Deno.chdir("./skychamps");

  const CONFIG_BASE = {
    http: {
      certFile: "",
      keyFile: "",
      port: 8000,
    },
    gameserver: {
      certFile: "",
      keyFile: "",
      port: 8001,
    },
  };

  await Deno.writeTextFile(
    "./config.json.example",
    JSON.stringify(CONFIG_BASE, undefined, 2),
  );

  await build();
}

if (import.meta.main) await install();
