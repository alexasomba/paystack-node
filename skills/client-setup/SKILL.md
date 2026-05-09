---
name: client-setup
description: Use when installing or configuring @alexasomba/paystack-node, creating a Node Paystack client, or choosing server-side authentication settings.
---

# Paystack Node Client Setup

Use `@alexasomba/paystack-node` for server-side Paystack API calls in Node.js. Do not use it in browser bundles.

## Install and import

```ts
import { createPaystack } from "@alexasomba/paystack-node";
```

Create one client near your payment service boundary and pass it into application code.

```ts
const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});
```

## Authentication

- Use a Paystack secret key: `sk_test_*` or `sk_live_*`.
- Read the secret key from environment or secret storage.
- Never commit keys or expose this SDK through client-rendered code.
- The default base URL is `https://api.paystack.co`; only set `baseUrl` for tests or explicit proxying.

## Options

```ts
const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  timeoutMs: 30_000,
  headers: {
    "X-App-Version": "payments-service",
  },
});
```

Use `fetch` only when the application already has a wrapped implementation for tracing, proxying, or tests.

## Best practices

- Keep payment initialization, transfers, refunds, and webhooks on the server.
- Put user-provided values in the typed operation payload, not in string-built URLs.
- Use live keys only in live environments and test keys in development or staging.
- Log Paystack request IDs from errors when escalating support issues.
