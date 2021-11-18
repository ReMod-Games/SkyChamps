import { Router } from "../deps.ts";
import type { HTTPState } from "../types/server_internals.ts";

const resourceRouter = new Router<HTTPState>({
  prefix: "/resources",
});

resourceRouter.get("/css/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `frontend/css/${ctx.params.file}`,
  );
  ctx.response.type = "text/css";
});

resourceRouter.get("/images/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `frontend/images/${ctx.params.file}`,
  );
  ctx.response.type = "image/png";
});

resourceRouter.get("/javascript/:dir/:file", async function (ctx) {
  ctx.state.tracker(ctx);
  ctx.response.body = await ctx.state.cache.get(
    `frontend/typescript/${ctx.params.dir}/${ctx.params.file}`,
  );
  ctx.response.type = "text/javascript";
});

export { resourceRouter };
