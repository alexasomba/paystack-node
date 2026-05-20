---
name: paystack-node-operation-discovery
description: Use when finding the correct generated operation helper in the Paystack Node SDK @alexasomba/paystack-node from a Paystack endpoint, OpenAPI operationId, tag, or path.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node."
---

# Paystack Node Operation Discovery

Use this skill when an agent knows the Paystack endpoint or business task but needs the exact SDK helper name.

## Naming model

The SDK binds generated OpenAPI operation IDs as flat helpers on the `paystack` object.

```ts
const paystack = createPaystack({ secretKey: process.env.PAYSTACK_SECRET_KEY! });

await paystack.transaction_initialize({ body: { email, amount } });
await paystack.transaction_verify({ params: { path: { reference } } });
```

The helper names usually follow:

- resource or tag prefix, such as `transaction`, `customer`, `subscription`, `transferrecipient`
- underscore
- action or endpoint-specific verb, such as `initialize`, `verify`, `create`, `list`

Do not invent nested clients like `paystack.transactions.initialize()` unless the SDK exports them.

## How to find a helper

1. Search the exported operation names in `src/operations.ts` or the generated declarations.
2. Prefer the exact OpenAPI `operationId` when available.
3. If starting from a REST path, search by the resource segment and action, then confirm the request shape from TypeScript.
4. Use `body`, `params.path`, and `params.query` exactly as inferred by the helper type.

## Common examples

- Initialize payment: `transaction_initialize`
- Verify transaction: `transaction_verify`
- List transactions: `transaction_list`
- Create customer: `customer_create`
- Resolve account number: `bank_resolveAccountNumber`
- Create transfer recipient: `transferrecipient_create`
- Create refund: `refund_create`

## Best practices

- Let TypeScript complete the helper name and request shape.
- Keep pagination fields in `params.query`.
- Keep path variables in `params.path`; never interpolate them into URLs manually.
- Prefer SDK helpers over direct `client.GET`, `client.POST`, or raw `fetch` unless debugging the generated binding itself.
