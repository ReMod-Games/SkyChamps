import { Router } from "../deps.ts";
/**
 * Game stuff
 */

const lobbyRouter = new Router({ prefix: "/lobby" });

lobbyRouter.get("/:id", function (ctx) {
  if (!ctx.params.id) return ctx.response.status = 400;
  const headers = new Headers();
  headers.set("id", ctx.params.id);
  ctx.response.headers = headers;
});

export { lobbyRouter };
