import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import { walkSync } from "https://deno.land/std/fs/walk.ts";

const VERSION = "0.1.0";
const ARCHIVE_URL =
  "https://github.com/ReMod-Games/SkyChamps/archive/refs/tags/";
const RELEASES_URL = "https://github.com/ReMod-Games/SkyChamps/releases/latest";

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
    default: "./logs",
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
      default: "latest",
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
  let tag = options.version;
  if (options.version === "latest") {
    console.log("Retrieving latest release");
    tag = await getLatestTag();
  }

  const tempFile = await downloadLatestArchive(tag);
  const tempDir = Deno.makeTempDirSync();
  await unzip(tempFile, tempDir);
  await move(tempDir + "/SkyChamps-" + tag);
}

async function run(options: Record<string, unknown>) {
  const debug = options.debug ? "DEBUG" : "";
  const args =
    `deno run --no-check --unstable --allow-read --allow-write --allow-net mod.ts ${debug}`
      .split(" ");
  const p = Deno.run({
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    cmd: args,
  });
  await p.status();
}

async function setup(options: Record<string, unknown>) {
  try {
    Deno.openSync("./mod.ts", { create: false, createNew: false });
  } catch {
    console.log("First time setup detected!");
    await update({ version: "latest" });
  }
  console.log("Generating config file");
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

async function downloadLatestArchive(tag: string): Promise<string> {
  console.log("Downloading release: " + tag);
  const s = await fetch(`${ARCHIVE_URL}${tag}.zip`);
  const buff = await s.arrayBuffer();
  const tempFile = await Deno.makeTempFile();
  await Deno.writeFile(tempFile, new Uint8Array(buff));
  return tempFile;
}

async function move(tempDir: string) {
  console.log("Writing to disk");
  const cwd = Deno.cwd();
  for await (const entry of walkSync(tempDir)) {
    const nPath = entry.path.replace(tempDir, cwd);
    if (entry.isDirectory) Deno.mkdirSync(nPath, { recursive: true });
    if (entry.isFile) Deno.copyFileSync(entry.path, nPath);
  }
}

async function unzip(file: string, tempDir: string) {
  console.log("Unzipping archive");
  const p = Deno.run({
    cmd: Deno.build.os === "windows"
      ? [
        "PowerShell",
        "Expand-Archive",
        "-Path",
        file,
        "-DestinationPath",
        tempDir,
      ]
      : ["unzip", "-o", file, "-d", tempDir],
    stdout: "null",
  });
  await p.status();
}

async function getLatestTag() {
  const f = await fetch(RELEASES_URL);
  return f.url.split("/").pop()!;
}
