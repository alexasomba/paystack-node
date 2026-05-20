---
name: paystack-node-typed-payloads
description: Use when choosing TypeScript typed requests, query params, response types, or grouped client types from the Paystack Node SDK @alexasomba/paystack-node.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node and @alexasomba/paystack-node/webhooks."
---

# Paystack Node Typed Payloads

The SDK exports stable type aliases for common payloads and grouped client slices. Prefer these aliases before reconstructing types from `ReturnType`, `paths`, or `operations`.

## Client types

```ts
import {
  type Paystack,
  type PaystackTransactionClient,
  type PaystackSubscriptionClient,
} from "@alexasomba/paystack-node";
```

Use grouped client types when injecting only part of the SDK into a service.

```ts
function makeCheckout(transaction: PaystackTransactionClient) {
  return transaction.transaction_initialize({
    body: { email: "customer@example.com", amount: 5000 },
  });
}
```

## Payload aliases

Use exported payload aliases for shared service interfaces and tests.

```ts
import type {
  TransactionInitializePayload,
  TransactionVerifyPathParams,
  SubscriptionCreatePayload,
  RefundCreatePayload,
} from "@alexasomba/paystack-node";
```

```ts
const body: TransactionInitializePayload = {
  email: "customer@example.com",
  amount: 5000,
};
```

## Generated OpenAPI types

The SDK also exports `paths`, `operations`, and `components` for advanced cases. Use them when no curated alias exists, but keep public application interfaces on the stable aliases when possible.

## Best practices

- Let TypeScript guide required body, path, and query fields.
- Avoid `any` around Paystack payloads; narrow with exported aliases.
- Do not copy generated schema shapes into local types unless you need a deliberate boundary type.
- Keep application-level DTOs separate from Paystack SDK payloads when you accept user input.
