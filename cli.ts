import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";

const VERSION = "0.1.0";

const setupCommand = new Command()
  .name("Setup")
  .description("Setup the full repo for the game server")
  .version(VERSION)
  .option("-D, --database [path:string]", "Set database path", {
    required: false,
    requiredValue: true,
    default: "./database.db",
  })
  .option("-C, --cards [path:string]", "Set card json file path", {
    required: false,
    requiredValue: true,
    default: "./cards.json",
  })
  .option("--http-port [port:number]", "http port to use", {
    required: false,
    requiredValue: true,
    default: 8000,
  })
  .option("--ws-port [port:number]", "Websocket port to use", {
    required: false,
    requiredValue: true,
    default: 8001,
  })
  .option("--cache, [enabled:boolean]", "Enable caching of frontend code", {
    required: false,
    default: true,
  })
  .option("-L, --log [path:string]", "Logging to file", {
    required: false,
    requiredValue: true,
    default: null,
  })
  .action(setup);

const runCommand = new Command()
  .name("Run")
  .description("Run the game server")
  .version(VERSION)
  .option("-D, --debug", "Enable debug mode")
  .action(run);

const updateCommand = new Command()
  .name("Update")
  .description("update the repo to the latest version!")
  .version(VERSION)
  .option(
    "-V, --version [version:string]",
    "Download a specific version (Mutually exclusive with --git)",
    {
      required: false,
      requiredValue: true,
      default: "main",
    },
  )
  .action(update);

await new Command()
  .name("SkyChamps CLI")
  .version(VERSION)
  .description("CLI for SkyChamps game server")
  .command("setup", setupCommand)
  .command("run", runCommand)
  .command("update", updateCommand)
  .parse(Deno.args);

async function update(options: Record<string, string>) {
  const p = Deno.run({
    cmd: [
      "git",
      "clone",
      "https://github.com/ReMod-Games/SkyChamps",
      "-q",
      "--depth",
      "1",
      "--single-branch",
      "--branch",
      options.version,
      "./",
    ],
    stdout: "null",
  });

  await p.status();
}

function run(options: Record<string, unknown>) {
  const debug = options.debug ? "DEBUG" : "";
  const args =
    `deno run --unstable --allow-read --allow-write --allow-net mod.ts ${debug}`
      .split(" ");
  const p = Deno.run({
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    cmd: args,
  });
  p.status().then((x) => Deno.exit(x.code));
}

function setup(options: Record<string, unknown>) {
  const config = {
    server: {
      http: {
        port: options.httpPort,
        caching: options.cache,
        otf: options.otfCompiling,
      },
      websocket: {
        port: options.wsPort,
      },
    },
    database: {
      path: options.database,
    },
    cards: {
      path: options.cards,
    },
    logging: {
      dir: options.log,
    },
  };
  Deno.writeTextFileSync(
    "./config.json",
    JSON.stringify(config, undefined, 2),
  );
}
