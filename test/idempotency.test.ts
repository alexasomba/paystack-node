import { describe, it, expect } from "vite-plus/test";

import { resolveIdempotencyKey, setHeader, hasHeader } from "../src/idempotency.js";

describe("Idempotency Logic", () => {
  describe("resolveIdempotencyKey", () => {
    it("should return static key", () => {
      expect(resolveIdempotencyKey({ mode: "static", key: "test_key" })).toBe("test_key");
    });

    it("should generate custom key", () => {
      const generate = () => "custom_key";
      expect(resolveIdempotencyKey({ mode: "custom", generate })).toBe("custom_key");
    });

    it("should generate automatic key (UUID-like)", () => {
      const key = resolveIdempotencyKey({ mode: "auto" });
      expect(key).toBeDefined();
      expect(key!.length).toBeGreaterThan(10);
      expect(resolveIdempotencyKey({ mode: "auto" })).not.toBe(key);
    });

    it('should return undefined for mode "none"', () => {
      expect(resolveIdempotencyKey({ mode: "none" })).toBeUndefined();
    });
  });

  describe("Header Helpers", () => {
    it("should check if header exists (case-insensitive)", () => {
      const headers = { "Idempotency-Key": "123" };
      expect(hasHeader(headers, "idempotency-key")).toBe(true);
      expect(hasHeader(headers, "OTHER")).toBe(false);
    });

    it("should set header correctly", () => {
      const headers = { Existing: "val" };
      const updated = setHeader(headers, "New-Header", "new_val");
      expect(updated.get("Existing")).toBe("val");
      expect(updated.get("New-Header")).toBe("new_val");
    });
  });
});
