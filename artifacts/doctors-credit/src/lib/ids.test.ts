import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatApplicationId,
  isApplicationId,
  isCallVerificationId,
  isConversationVerificationId,
  newCallVerificationId,
  newConversationVerificationId,
} from "./ids";

describe("public identifiers", () => {
  it("formats sequential application IDs", () => {
    assert.equal(formatApplicationId(1), "DC-000001");
    assert.equal(formatApplicationId(2), "DC-000002");
    assert.equal(isApplicationId("DC-000001"), true);
    assert.equal(isApplicationId("user@email.com"), false);
  });

  it("creates unique conversation verification IDs", () => {
    const ids = new Set(Array.from({ length: 200 }, () => newConversationVerificationId()));
    assert.equal(ids.size, 200);
    for (const id of ids) assert.equal(isConversationVerificationId(id), true);
  });

  it("creates call verification IDs that expose no PII", () => {
    const id = newCallVerificationId();
    assert.equal(isCallVerificationId(id), true);
    assert.equal(/@|\d{3}-\d{3}/.test(id), false);
  });
});
