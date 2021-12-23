import { isValidPayload } from "../../utils/match/validate_payload.ts";
import { assert } from "../test_deps.ts";

const payload = {
  type: "",
  another: "",
  key: "",
};

Deno.test({
  name: "Validate Payload",
  fn() {
    const valid = isValidPayload(payload, ["type", "another", "key"]);

    const invalid = isValidPayload(payload, ["type", "another"]);
    assert(valid);
    assert(!invalid);
  },
  sanitizeExit: true,
  sanitizeOps: true,
  sanitizeResources: true,
});
