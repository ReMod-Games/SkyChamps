import Config from "../config.json" assert { type: "json" };
import { Application } from "./deps.ts";
import { STATE } from "./state.ts";

const app = new Application({
  contextState: "alias",
  state: STATE,
});

await app.listen({
  port: Config.http.port,
});
