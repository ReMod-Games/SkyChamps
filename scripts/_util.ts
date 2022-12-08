const which = Deno.build.os === "windows" ? "where" : "which";

export async function requires(...commands: string[]): Promise<boolean> {
  const promises = commands.map((x) =>
    Deno.run({
      cmd: [which, x],
      stderr: "null",
      stdin: "null",
      stdout: "null",
    }).status()
  );

  const result = await Promise
    .all(promises);

  return !result.reduce((acc, s) => acc + s.code, 0);
}

export function run(...args: string[]): Promise<boolean> {
  return Deno.run({
    cmd: args,
    stderr: "inherit",
    stdin: "null",
    stdout: "inherit",
  }).status().then((x) => !!x.code);
}
