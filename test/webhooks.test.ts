import { describe, it, expect } from "vite-plus/test";
import { Webhooks } from "../src/webhooks.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

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

  const computeSignature = (p: string, s: string) => {
    const encoder = new TextEncoder();
    return bytesToHex(hmac(sha512, encoder.encode(s), encoder.encode(p)));
  };

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
