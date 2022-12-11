const which = Deno.build.os === "windows" ? "where" : "which";

export async function requires(...commands: string[]) {
  for (let i = 0; i < commands.length; i++) {
    const process = Deno.run({
      cmd: [which, commands[i]],
      stderr: "null",
      stdin: "null",
      stdout: "null",
    });

    const status = await process.status();
    process.close();

    if (!status.success) {
      console.error(`Missing Shell Command: [${commands[i]}]`);
      Deno.exit(1);
    }
  }
}

export async function run(...args: string[]) {
  const process = Deno.run({
    cmd: args,
    stderr: "inherit",
    stdin: "null",
    stdout: "inherit",
  });

  const status = await process.status();
  process.close();
  if (!status.success) Deno.exit(status.code);
}
