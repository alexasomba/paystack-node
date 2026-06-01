import { describe, it, expect } from "vite-plus/test";
import { PaystackError, getPaystackRequestId, isPaystackApiError } from "../src/errors.js";

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

  describe("PaystackError", () => {
    it("should correctly capture error details", () => {
      const raw = {
        status: false,
        message: "Failed",
        code: "invalid_params",
        type: "validation_error",
      };
      const cause = new Error("Original transport error");
      const error = new PaystackError({
        message: "Failed",
        status: 400,
        requestId: "req_123",
        code: "invalid_params",
        type: "validation_error",
        meta: { field: "email" },
        raw,
        cause,
      });

      expect(error.message).toContain("Failed");
      expect(error.message).toContain("req_123");
      expect(error.status).toBe(400);
      expect(error.requestId).toBe("req_123");
      expect(error.code).toBe("invalid_params");
      expect(error.type).toBe("validation_error");
      expect(error.meta).toEqual({ field: "email" });
      expect(error.raw).toBe(raw);
      expect(error.body).toBe(raw);
      expect(error.cause).toBe(cause);
      expect(isPaystackApiError(error)).toBe(true);
    });

    it("should identify validation errors", () => {
      const error = new PaystackError({
        message: "Err",
        type: "validation_error",
      });
      expect(error.isValidationError()).toBe(true);
      expect(error.isProcessorError()).toBe(false);
    });

    it("should identify processor errors", () => {
      const error = new PaystackError({
        message: "Err",
        type: "processor_error",
      });
      expect(error.isProcessorError()).toBe(true);
    });
  });
});
