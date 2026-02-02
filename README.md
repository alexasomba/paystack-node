# @alexasomba/paystack-node

TypeScript-first Paystack API client for Node.js, generated from this repo’s OpenAPI spec.

This package provides:
- A typed low-level client (`createPaystackClient`) backed by `openapi-fetch`
- Ergonomic operation helpers generated from `operationId` (`transaction_initialize`, `transferrecipient_update`, ...)

## Why this SDK

- Spec-driven: generated from the OpenAPI spec in this repo (keeps surface area aligned with the spec).
- Production-friendly networking: built-in `timeoutMs` and safe `retry` defaults.
- Safe retries for POST: optional `idempotencyKey` support (so retries don’t accidentally duplicate operations).
- Better debugging: `PaystackApiError` includes `status` and `requestId` when available.

## Modules

- [x] Charge
- [x] Customers
- [x] Plans
- [x] Products
- [x] Subscriptions
- [x] Transactions
- [x] Verify Payments (Transaction verification)
- [x] Transfers
- [x] Dedicated Virtual Accounts
- [x] Apple Pay
- [x] Subaccounts
- [x] Transaction Splits
- [x] Settlements
- [x] Transfers Control (OTP settings; under Transfers)
- [x] Transfer Recipients
- [x] Bulk Charges
- [x] Refunds
- [x] Verification (Resolve Account / Validate Account / Resolve Card BIN)
- [x] Miscellaneous
- [x] Disputes
- [x] Control Panel (Payment session timeout)
- [x] Terminal
- [x] Virtual Terminal
- [x] Direct Debit
- [x] Payment Pages
- [x] Payment Requests (Invoices)
- [x] Integration
- [x] Balance
- [x] Banks
- [x] Orders
- [x] Storefronts

## Install

```bash
pnpm add @alexasomba/paystack-node
# or: npm i @alexasomba/paystack-node
# or: yarn add @alexasomba/paystack-node
```

## Usage

```ts
import { assertOk, createPaystack, PaystackApiError, toPaystackApiError } from '@alexasomba/paystack-node';

const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  // Optional reliability knobs
  timeoutMs: 30_000,
  retry: { retries: 2 },
  // Optional: auto-add Idempotency-Key on POST requests
  idempotencyKey: 'auto',
});

// ergonomic operation wrappers (generated from operationId)
const result = await paystack.transaction_initialize({
  body: {
    email: 'customer@example.com',
    amount: 5000,
  },
});

try {
  const data = assertOk(result);
  console.log(data);
} catch (e) {
  if (e instanceof PaystackApiError) {
    // Useful for support/debugging
    console.error('Paystack requestId:', e.requestId);
  }
  throw e;
}

// Alternative: convert without throwing
const apiError = toPaystackApiError(result);
if (apiError) {
  console.error(apiError.requestId, apiError.status);
}
```

### Usage (CommonJS)

```js
const { createPaystack } = require('@alexasomba/paystack-node');

const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY,
});
```

### Low-level client usage

If you prefer calling by path/method:

```ts
import { createPaystackClient } from '@alexasomba/paystack-node';

const client = createPaystackClient({ secretKey: process.env.PAYSTACK_SECRET_KEY! });

const { data, error } = await client.POST('/transaction/initialize', {
  body: { email: 'customer@example.com', amount: 5000 },
});

if (error) throw error;
console.log(data);
```

## Coverage

- The Node SDK currently generates ~119 typed operations from the bundled SDK OpenAPI spec.
- For missing/incorrect endpoints, please open an issue or PR against the spec (`src/assets/sdk/paystack.yaml`).

## Webhooks

Webhook signature verification requires the *raw request body*.

```ts
import { verifyPaystackWebhookSignature } from '@alexasomba/paystack-node';

const ok = verifyPaystackWebhookSignature({
  rawBody: req.rawBody,
  signature: req.headers['x-paystack-signature'] as string,
  secret: process.env.PAYSTACK_SECRET_KEY!,
});
```

