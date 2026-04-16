import { describe, it, expect, vi, beforeEach } from "vite-plus/test";

import { createPaystack } from "../src/index.js";

describe("Client Functional Tests", () => {
  const secretKey = "sk_test_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Retry Logic", () => {
    it("should retry on 503 and eventually succeed", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 503 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ status: true, data: { ok: true } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );

      const paystack = createPaystack({
        secretKey,
        fetch: mockFetch,
        retry: { minDelayMs: 1, maxDelayMs: 2 },
      });

      const { data } = await paystack.transaction.list();

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(data).toEqual({ ok: true });
    });

    it("should honor Retry-After header for 429", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 429,
            headers: { "Retry-After": "0.001" },
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ status: true, data: { ok: true } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );

      const paystack = createPaystack({
        secretKey,
        fetch: mockFetch,
        retry: { minDelayMs: 1, maxDelayMs: 2 },
      });

      await paystack.transaction.list();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("should fail after max retries", async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));

      const paystack = createPaystack({
        secretKey,
        fetch: mockFetch,
        retry: { retries: 2, minDelayMs: 1, maxDelayMs: 2 },
      });

      const { response } = await paystack.transaction.list();
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(response.status).toBe(503);
    });
  });

  describe("Timeout", () => {
    it("should abort request if it exceeds timeoutMs", async () => {
      const mockFetch = vi.fn().mockImplementation(
        (input, init) =>
          new Promise((resolve, reject) => {
            const timer = setTimeout(() => resolve(new Response()), 100);
            if (init?.signal !== undefined && init.signal !== null) {
              init.signal.addEventListener("abort", () => {
                clearTimeout(timer);
                reject(new Error("Aborted"));
              });
            }
          }),
      );

      const paystack = createPaystack({
        secretKey,
        fetch: mockFetch,
        timeoutMs: 10,
      });

      await expect(paystack.transaction.list()).rejects.toThrow();
    });
  });

  describe("Subscription Module", () => {
    async function getRequestInfo(mockCall: any[]) {
      const [input, init] = mockCall;
      if (input instanceof Request) {
        return {
          url: input.url,
          method: input.method,
          body: await input.clone().text(),
          headers: input.headers,
        };
      }
      return {
        url: typeof input === "string" ? input : input.toString(),
        method: init?.method ?? "GET",
        body: init?.body !== undefined && init.body !== null ? String(init.body) : undefined,
        headers: new Headers(init?.headers),
      };
    }

    it("should correctly format subscription_create request", async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const paystack = createPaystack({ secretKey, fetch: mockFetch });

      const { raw } = await paystack.subscription.create({
        body: {
          customer: "CUS_mock",
          plan: "PLN_mock",
        },
      });

      const info = await getRequestInfo(mockFetch.mock.calls[0]);
      expect(info.url).toContain("/subscription");
      expect(info.method).toBe("POST");
      expect(JSON.parse(info.body!)).toEqual({
        customer: "CUS_mock",
        plan: "PLN_mock",
      });
      expect(raw?.status).toBe(true);
    });

    it("should correctly format subscription_list request with query params", async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const paystack = createPaystack({ secretKey, fetch: mockFetch });

      await paystack.subscription.list({
        params: {
          query: { customer: "123", plan: "456" },
        } as any,
      });

      const info = await getRequestInfo(mockFetch.mock.calls[0]);
      const parsedUrl = new URL(info.url, "https://api.paystack.co");
      expect(parsedUrl.searchParams.get("customer")).toBe("123");
      expect(parsedUrl.searchParams.get("plan")).toBe("456");
    });
  });
});
