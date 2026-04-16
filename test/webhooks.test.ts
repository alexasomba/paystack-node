import { describe, it, expect } from "vite-plus/test";
import { Webhooks } from "../src/webhooks.js";
import { createHmac } from "node:crypto";

describe("Webhook Verification", () => {
  const secret = "sk_test_1234567890abcdef1234567890abcdef12345678";
  const payload = JSON.stringify({
    event: "charge.success",
    data: {
      id: 123,
      domain: "test",
      status: "success",
      amount: 5000,
    },
  });

  const computeSignature = (p: string | Buffer, s: string) =>
    createHmac("sha512", s).update(p).digest("hex");

  it("should verify a valid signature", () => {
    const signature = computeSignature(payload, secret);
    const ok = Webhooks.verifySignature(payload, signature, secret);
    expect(ok).toBe(true);
  });

  it("should fail for an invalid signature", () => {
    const ok = Webhooks.verifySignature(payload, "invalid_signature", secret);
    expect(ok).toBe(false);
  });

  it("should parse typed event", () => {
    const event = Webhooks.parseEvent(payload);
    expect(event.event).toBe("charge.success");
    expect(event.data.id).toBe(123);
  });
});
