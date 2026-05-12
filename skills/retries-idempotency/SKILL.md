---
name: retries-idempotency
description: Use when configuring @alexasomba/paystack-node retries, Retry-After behavior, idempotency keys, timeouts, and safe retry semantics.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node and @alexasomba/paystack-node/webhooks."
---

# Paystack Node Retries and Idempotency

The Node SDK can retry transient failures and add idempotency keys to POST requests. Configure this deliberately for payment, transfer, refund, and customer mutations.

## Retry configuration

```ts
const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  retry: {
    retries: 3,
    minDelayMs: 500,
    maxDelayMs: 5_000,
    retryOnStatuses: [408, 429, 500, 502, 503, 504],
  },
});
```

The SDK respects `Retry-After` on `429` responses when present.

## Idempotency

Use `idempotencyKey: "auto"` for generated UUID keys on POST requests.

```ts
const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  idempotencyKey: "auto",
});
```

Use a stable custom key when retrying the same business operation across process restarts.

```ts
const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  idempotencyKey: () => currentPaymentAttempt.idempotencyKey,
});
```

## Helper exports

The SDK also exports lower-level helpers for advanced transport or testing work:

- `DEFAULT_IDEMPOTENCY_HEADER`
- `createIdempotencyKey()`
- `resolveIdempotencyKey(input)`
- `hasHeader(headers, name)`
- `setHeader(headers, name, value)`

Prefer the top-level `createPaystack({ idempotencyKey })` option for application code. Use helper exports when testing header behavior or building SDK-adjacent transport utilities.

## Best practices

- Retry GET, HEAD, and OPTIONS freely for transient failures.
- Retry POST only when an idempotency key is present.
- Store the business operation reference and Paystack reference in your database.
- Use timeouts so payment calls cannot hang request workers indefinitely.
- Do not reuse a static idempotency key for unrelated operations.
