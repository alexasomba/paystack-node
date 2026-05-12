---
name: api-operations
description: Use when calling Paystack API operations with @alexasomba/paystack-node, including request body, path params, query params, and pagination.
---

# Paystack Node API Operations

## License and compatibility

- License: MIT, same as `@alexasomba/paystack-node`.
- Runtime compatibility: Node.js >=22.0.0; ESM-only package with `type: "module"`.
- Supported import paths: `@alexasomba/paystack-node` and `@alexasomba/paystack-node/webhooks`.
- Intended environment: backend/server runtimes. Do not bundle this SDK into browser code because it uses Paystack secret keys.

The Node SDK exposes grouped helpers generated from the OpenAPI operation IDs. Prefer these helpers over low-level `client.GET` or manual `fetch`.

## Request shape

- JSON request bodies go in `body`.
- Path parameters go in `params.path`.
- Query parameters go in `params.query`.
- Empty operations can be called with no argument.

```ts
const initialized = await paystack.transaction_initialize({
  body: {
    email: "customer@example.com",
    amount: 5000,
  },
});
```

```ts
const verified = await paystack.transaction_verify({
  params: {
    path: { reference: "ref_123" },
  },
});
```

```ts
const customers = await paystack.customer_list({
  params: {
    query: { perPage: 50, page: 1 },
  },
});
```

## Operation naming

Use the generated grouped names already exported by the SDK, for example:

- `transaction_initialize`
- `transaction_verify`
- `customer_create`
- `subscription_create`
- `transferrecipient_create`
- `refund_create`
- `bank_resolveAccountNumber`

Do not invent convenience methods such as `subscription.update` unless they exist on the generated client.

## Pagination

Paystack list endpoints commonly support `page`, `perPage`, and sometimes cursor fields such as `next` or `previous`. Keep pagination parameters inside `params.query` and inspect the response body `meta` and headers when advancing pages.

## Best practices

- Send amounts in the lowest currency denomination for the currency.
- Verify transactions on the server after redirects or checkout callbacks.
- Keep customer-facing references unique and idempotent in your own system.
- Treat Paystack response `status: false` as a failed operation even if the HTTP status is 2xx.
