---
name: responses-errors
description: Use when handling @alexasomba/paystack-node responses, PaystackResponse, unwrap, PaystackError, request IDs, and Paystack API envelopes.
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

## Best practices

- Do not rely only on HTTP status; Paystack may return an envelope with `status: false`.
- Log `requestId` when available for support and reconciliation.
- Keep raw response logging redacted; payment metadata can contain personal data.
- Use `.response.headers` only for transport details such as pagination headers or request IDs.
