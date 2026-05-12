---
name: transport-testing
description: Use when testing or customizing @alexasomba/paystack-node transport behavior with custom fetch, baseUrl, timeouts, retries, mocked responses, or local Paystack API proxies.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node."
---

# Paystack Node Transport and Testing

The Node SDK accepts a custom `fetch`, `baseUrl`, headers, timeout, retry, and idempotency options through `createPaystack`.

## Custom fetch

Use `fetch` injection for tests, tracing, local proxies, or controlled network behavior.

```ts
const calls: RequestInfo[] = [];

const paystack = createPaystack({
  secretKey: "sk_test_123",
  fetch: async (input, init) => {
    calls.push(input);
    return Response.json({
      status: true,
      message: "OK",
      data: { reference: "ref_123" },
    });
  },
});
```

The SDK wraps the provided `fetch` to apply timeout, retry, and idempotency behavior before requests reach OpenAPI helpers.

## Mocking response envelopes

Return Paystack-style envelopes from tests:

```ts
return Response.json(
  { status: false, message: "Invalid reference", data: null },
  { status: 200, headers: { "x-paystack-request-id": "req_123" } },
);
```

Use `PaystackResponse.unwrap()` or `assertOk` patterns from the response/error skill when asserting failures.

## Local base URL

Use `baseUrl` for local integration tests or a controlled proxy only.

```ts
const paystack = createPaystack({
  secretKey: "sk_test_123",
  baseUrl: "http://127.0.0.1:8787",
});
```

## Best practices

- Do not mock only raw `data`; include Paystack's `status`, `message`, and `data` envelope.
- Assert authorization and idempotency headers in transport tests.
- Test retries with reusable request bodies; streams may not be retryable.
- Use fake timers or low retry delays when testing retry behavior.
