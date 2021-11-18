import { Router } from "../deps.ts";
import type { HTTPState } from "../types/server_internals.ts";

const resourceRouter = new Router<HTTPState>({
  prefix: "/resources",
});

resourceRouter.use((ctx) => ctx.state.tracker(ctx));

resourceRouter.get("/css/:file", function (ctx) {
  ctx.response.body = ctx.state.cache.get(
    `./frontend/css/${ctx.params.file}`,
  );
});

resourceRouter.get("/images/:file", function (ctx) {
  ctx.response.body = ctx.state.cache.get(
    `./frontend/images/${ctx.params.file}`,
  );
});

resourceRouter.get("/javascript/:file", function (ctx) {
  ctx.response.body = ctx.state.cache.get(
    `./frontend/typescript/${ctx.params.file}`,
  );
});

export { resourceRouter };
