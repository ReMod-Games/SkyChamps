import { compile } from "../../utils/otf_compile.ts";
import { assertEquals } from "../test_deps.ts";

// deno-lint-ignore no-explicit-any
(self as any).postMessage = (v: unknown) => void (v);
const expectedJsOutput =
  "function _concat(stringOne,stringTwo){return stringOne+stringTwo}";

Deno.test({
  name: "On the fly TS compiler",
  async fn() {
    const output = await compile("./test/data/typescript_file.ts", "test File");
    assertEquals(output, expectedJsOutput);
  },
  sanitizeExit: true,
  sanitizeOps: true,
  sanitizeResources: true,
});
