import { Router } from "../deps.ts";
import type { ServerState } from "../types.ts";

const resourceRouter = new Router<{ file: string }, ServerState>({
  prefix: "/resources",
});

// This is explicit to avoid UB
resourceRouter.get("/css/:file", async function (ctx) {
  ctx.response.body = await ctx.state.cache.get(
    `./resources/css/${ctx.params.file}`,
  );
});

resourceRouter.get("/images/:file", async function (ctx) {
  ctx.response.body = await ctx.state.cache.get(
    `./resources/images/${ctx.params.file}`,
  );
});

resourceRouter.get("/javascript/:file", async function (ctx) {
  ctx.response.body = await ctx.state.cache.get(
    `./resources/javascript/${ctx.params.file}`,
  );
});

export { resourceRouter };
