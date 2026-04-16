import { describe, it, expect } from "vite-plus/test";
import { PaystackResponse } from "../src/response.js";
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
  });

  it("should throw PaystackError on status false", () => {
    const raw = {
      status: false,
      message: "Invalid transaction",
      data: null,
    };
    const response = new Response(JSON.stringify(raw), {
      status: 400,
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
      expect(paystackErr.status).toBe(400);
    }
  });

  it("should throw PaystackError on network/HTTP error", () => {
    const response = new Response(null, { status: 500 });
    const wrapper = new PaystackResponse(undefined, { msg: "Fail" }, response);

    expect(() => wrapper.unwrap()).toThrow(PaystackError);
  });
});
