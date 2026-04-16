import { describe, it, expect } from "vite-plus/test";

import {
  PaystackApiError,
  toPaystackApiError,
  assertOk,
  getPaystackRequestId,
} from "../src/errors.js";

describe("Error Handling", () => {
  describe("getPaystackRequestId", () => {
    it("should extract request ID from headers", () => {
      const headers = new Headers({
        "x-paystack-request-id": "req_123",
      });
      expect(getPaystackRequestId(headers)).toBe("req_123");
    });

    it("should fallback to x-request-id", () => {
      const headers = { "x-request-id": "req_456" };
      expect(getPaystackRequestId(headers)).toBe("req_456");
    });

    it("should return undefined if no request ID header is present", () => {
      expect(getPaystackRequestId({})).toBeUndefined();
    });
  });

  describe("PaystackApiError", () => {
    it("should correctly capture error details", () => {
      const error = new PaystackApiError("Failed", {
        status: 400,
        requestId: "req_123",
        url: "https://api.paystack.co/test",
        error: { message: "Invalid parameter" },
      });

      expect(error.message).toBe("Failed");
      expect(error.status).toBe(400);
      expect(error.requestId).toBe("req_123");
      expect(error.url).toBe("https://api.paystack.co/test");
      expect(error.error).toEqual({ message: "Invalid parameter" });
    });
  });

  describe("toPaystackApiError", () => {
    it("should return undefined if there is no error", () => {
      const result = {
        data: { success: true },
        response: new Response(null, { status: 200 }),
      };
      expect(toPaystackApiError(result)).toBeUndefined();
    });

    it("should return PaystackApiError if error exists", () => {
      const result = {
        error: { message: "Bad request" },
        response: new Response(null, {
          status: 400,
          headers: { "x-paystack-request-id": "req_123" },
        }),
      };
      const apiError = toPaystackApiError(result);
      expect(apiError).toBeInstanceOf(PaystackApiError);
      expect(apiError?.status).toBe(400);
      expect(apiError?.requestId).toBe("req_123");
    });
  });

  describe("assertOk", () => {
    it("should return data if no error", () => {
      const result = {
        data: { id: 1 },
        response: new Response(null, { status: 200 }),
      };
      expect(assertOk(result)).toEqual({ id: 1 });
    });

    it("should throw PaystackApiError if error exists", () => {
      const result = {
        error: { message: "Forbidden" },
        response: new Response(null, { status: 403 }),
      };
      expect(() => assertOk(result)).toThrow(PaystackApiError);
    });
  });
});
