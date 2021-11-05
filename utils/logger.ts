import {
  ConsoleStream,
  Context,
  every,
  FileStream,
  Logger,
  TokenReplacer,
} from "../deps.ts";

const console = new ConsoleStream()
  .withMinLogLevel(10)
  .withFormat(
    new TokenReplacer()
      .withDateTimeFormat("YYYY-MM-DD hh:mm:ss:SSS")
      .withColor(),
  ).withLogHeader(false);

const file = new FileStream("./logs/output.log")
  .withMinLogLevel(10)
  .withBufferSize(10)
  .withFormat(
    new TokenReplacer()
      .withDateTimeFormat("YYYY-MM-DD hh:mm:ss:SSS")
      .withColor(false),
  ).withLogFileInitMode("append")
  .withLogFileRotation(every(1).days()).withLogHeader(false);

file.setup();

const logger = new Logger().addStream(file).addStream(console);
function tracker(ctx: Context) {
  logger.info(
    `new ${ctx.request.method} from ${ctx.request.ip} to ${ctx.request.url}`,
  );
}

export { logger, tracker };
