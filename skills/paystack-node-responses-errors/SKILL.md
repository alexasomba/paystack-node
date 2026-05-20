---
name: paystack-node-responses-errors
description: Use when handling Paystack SDK responses and errors in @alexasomba/paystack-node, including PaystackResponse, unwrap, PaystackError, request IDs, and Paystack API envelopes.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node and @alexasomba/paystack-node/webhooks."
---

# Paystack Node Responses and Errors

Operation helpers return a `PaystackResponse<T>` wrapper. Handle both HTTP failures and Paystack envelope failures.

## Successful responses

Use `.unwrap()` when you want the typed `data` payload or an exception on failure.

```ts
const result = await paystack.transaction_verify({
  params: { path: { reference: "ref_123" } },
});

const data = result.unwrap();
```

Use `.raw` when you need the full Paystack envelope with `status`, `message`, `data`, and `meta`.

```ts
if (result.raw?.status) {
  console.log(result.raw.message);
}
```

## Errors

Catch `PaystackError` from `.unwrap()` to access status and request diagnostics.

```ts
import { PaystackError } from "@alexasomba/paystack-node";

try {
  const data = result.unwrap();
} catch (error) {
  if (error instanceof PaystackError) {
    console.error(error.status, error.message, error.requestId);
  }
}
```

`PaystackError` exposes `status`, `requestId`, `code`, `type`, and `meta`. Use `isProcessorError()` and `isValidationError()` when branching on Paystack error categories.

## Helper exports

Use `getPaystackRequestId(headers)` when extracting diagnostics from raw responses or mocked transport tests. Request IDs are commonly returned in `x-paystack-request-id` or `x-request-id`.

## Best practices

- Do not rely only on HTTP status; Paystack may return an envelope with `status: false`.
- Log `requestId` when available for support and reconciliation.
- Keep raw response logging redacted; payment metadata can contain personal data.
- Use `.response.headers` only for transport details such as pagination headers or request IDs.
