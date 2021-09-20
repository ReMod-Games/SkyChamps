import { Router } from "../deps.ts";

const resourceRouter = new Router({ prefix: "/resources" });

resourceRouter.get("/card/:id", function (_ctx) {});
resourceRouter.get("/css/:id", function (_ctx) {});
resourceRouter.get("/js/:id", function (_ctx) {});
resourceRouter.get("/misc/:id", function (_ctx) {});

export { resourceRouter };
