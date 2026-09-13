import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clearedSessionCookie, SESSION_COOKIE } from "./session";

describe("patient session", () => {
  it("clears the HttpOnly session cookie without changing stored applications", () => {
    const cookie = clearedSessionCookie();
    assert.equal(cookie.name, SESSION_COOKIE);
    assert.equal(cookie.value, "");
    assert.equal(cookie.maxAge, 0);
    assert.equal(cookie.httpOnly, true);
    assert.equal(cookie.sameSite, "lax");
    assert.equal(cookie.path, "/");
  });
});
