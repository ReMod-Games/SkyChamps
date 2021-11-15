import { Router } from "../deps.ts";
import type { HTTPState } from "../types/server_internals.ts";

const resourceRouter = new Router<{ file: string }, HTTPState>({
  prefix: "/resources",
});

// This is explicit to avoid UB
resourceRouter.get("/css/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `./frontend/css/${ctx.params.file}`,
  );
});

resourceRouter.get("/images/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `./frontend/images/${ctx.params.file}`,
  );
});

resourceRouter.get("/javascript/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `./frontend/typescript/${ctx.params.file}`,
  );
});

export { resourceRouter };
