import { describe, it, expect } from "vite-plus/test";
import { PaystackResponse, assertOk, toPaystackApiError } from "../src/response.js";
import { PaystackError } from "../src/errors.js";

describe("PaystackResponse", () => {
  it("should unwrap successful response", () => {
    const raw = {
      status: true,
      message: "Success",
      data: { id: 123 },
    };
    const response = new Response(JSON.stringify(raw), { status: 200 });
    const wrapper = new PaystackResponse(raw, undefined, response);

    expect(wrapper.status).toBe(true);
    expect(wrapper.message).toBe("Success");
    expect(wrapper.unwrap()).toEqual({ id: 123 });
    expect(wrapper.data).toEqual({ id: 123 });
    expect(assertOk(wrapper)).toEqual({ id: 123 });
    expect(toPaystackApiError(wrapper)).toBeUndefined();
  });

  it("should throw PaystackError on status false with envelope details", () => {
    const raw = {
      status: false,
      message: "Invalid transaction",
      data: null,
      code: "invalid_transaction",
      type: "validation_error",
      meta: { nextStep: "Send a valid reference" },
    };
    const response = new Response(JSON.stringify(raw), {
      status: 200,
      headers: { "x-paystack-request-id": "req_1" },
    });
    const wrapper = new PaystackResponse(raw, undefined, response);

    expect(() => wrapper.unwrap()).toThrow(PaystackError);
    try {
      wrapper.unwrap();
    } catch (err) {
      const paystackErr = err as PaystackError;
      expect(paystackErr.message).toContain("Invalid transaction");
      expect(paystackErr.requestId).toBe("req_1");
      expect(paystackErr.status).toBe(200);
      expect(paystackErr.code).toBe("invalid_transaction");
      expect(paystackErr.type).toBe("validation_error");
      expect(paystackErr.meta).toEqual({ nextStep: "Send a valid reference" });
      expect(paystackErr.raw).toBe(raw);
      expect(paystackErr.body).toBe(raw);
    }
  });

  it("should throw PaystackError on non-2xx Paystack error responses", () => {
    const errorEnvelope = {
      status: false,
      message: "Duplicate Transaction Reference",
      meta: { nextStep: "Try a new reference" },
      type: "validation_error",
      code: "duplicate_reference",
      errorCodeMappingNotFound: false,
    };
    const response = new Response(JSON.stringify(errorEnvelope), {
      status: 400,
      headers: { "x-paystack-request-id": "req_bad" },
    });
    const wrapper = new PaystackResponse(undefined, errorEnvelope, response);

    expect(() => wrapper.unwrap()).toThrow(PaystackError);
    const error = toPaystackApiError(wrapper);
    expect(error).toBeInstanceOf(PaystackError);
    expect(error?.message).toContain("Duplicate Transaction Reference");
    expect(error?.requestId).toBe("req_bad");
    expect(error?.status).toBe(400);
    expect(error?.code).toBe("duplicate_reference");
    expect(error?.type).toBe("validation_error");
    expect(error?.meta).toEqual({ nextStep: "Try a new reference" });
    expect(error?.raw).toBe(errorEnvelope);
    expect(error?.body).toBe(errorEnvelope);
    expect(error?.cause).toBe(errorEnvelope);
  });

  it("should preserve transport error causes", () => {
    const cause = new Error("socket hang up");
    const response = new Response(null, { status: 500 });
    const wrapper = new PaystackResponse(undefined, cause, response);

    expect(() => wrapper.unwrap()).toThrow(PaystackError);
    try {
      wrapper.unwrap();
    } catch (err) {
      const paystackErr = err as PaystackError;
      expect(paystackErr.message).toContain("socket hang up");
      expect(paystackErr.status).toBe(500);
      expect(paystackErr.cause).toBe(cause);
    }
  });
});
