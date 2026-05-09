import fs from "node:fs";

import { describe, expect, it, vi } from "vite-plus/test";

import { createPaystack } from "../src/index.js";

const fixtures = JSON.parse(
  fs.readFileSync(new URL("../../contract-fixtures/paystack.json", import.meta.url), "utf8"),
);

async function requestInfo(call: unknown[]) {
  const [input, init] = call as [RequestInfo | URL, RequestInit | undefined];
  if (input instanceof Request) {
    const headers = new Headers(input.headers);
    new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
    return {
      url: input.url,
      method: input.method,
      headers,
      body: await input.clone().text(),
    };
  }

  return {
    url: String(input),
    method: init?.method ?? "GET",
    headers: new Headers(init?.headers),
    body: typeof init?.body === "string" ? init.body : undefined,
  };
}

describe("Paystack contract fixtures", () => {
  it("sends auth, idempotency, and initialize body according to the shared fixture", async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(fixtures.transactionInitialize.response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Paystack-Request-Id": fixtures.requestId,
        },
      }),
    );

    const paystack = createPaystack({
      secretKey: fixtures.secretKey,
      baseUrl: "https://mock.paystack.test",
      fetch,
      idempotencyKey: "contract-idempotency",
    });

    const result = await paystack.transaction.initialize({
      body: fixtures.transactionInitialize.request,
    });

    const info = await requestInfo(fetch.mock.calls[0]);
    expect(info.url).toBe("https://mock.paystack.test/transaction/initialize");
    expect(info.method).toBe("POST");
    expect(info.headers.get("Authorization")).toBe(`Bearer ${fixtures.secretKey}`);
    expect(info.headers.get("Idempotency-Key")).toBe("contract-idempotency");
    expect(JSON.parse(info.body ?? "{}")).toEqual(fixtures.transactionInitialize.request);
    expect(result.data).toEqual(fixtures.transactionInitialize.response.data);
  });

  it("serializes list query params and preserves pagination metadata", async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(fixtures.transactionList.response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const paystack = createPaystack({
      secretKey: fixtures.secretKey,
      baseUrl: "https://mock.paystack.test",
      fetch,
    });

    const result = await paystack.transaction.list({
      params: { query: fixtures.transactionList.query },
    } as never);

    const info = await requestInfo(fetch.mock.calls[0]);
    const url = new URL(info.url);
    expect(url.pathname).toBe("/transaction");
    expect(url.searchParams.get("perPage")).toBe("1");
    expect(url.searchParams.get("page")).toBe("2");
    expect(result.raw?.meta).toEqual(fixtures.transactionList.response.meta);
  });
});
