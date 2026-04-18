# @alexasomba/paystack-node

[![npm version](https://img.shields.io/npm/v/@alexasomba/paystack-node.svg)](https://www.npmjs.com/package/@alexasomba/paystack-node)
[![license](https://img.shields.io/npm/l/@alexasomba/paystack-node.svg)](https://github.com/alexasomba/paystack-node/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alexasomba/paystack-node)](https://bundlephobia.com/package/@alexasomba/paystack-node)

TypeScript-first Paystack API client for Node.js, generated from the official Paystack OpenAPI spec.

## Features

- **Spec-driven Accuracy**: Generated directly from the Paystack OpenAPI specification.
- **100% Type-safe**: Full TypeScript support with generated types for every endpoint, request, and response.
- **Smart Retries**: Automatic retries for transient failures with exponential backoff and jitter.
- **Retry-After Compliance**: Automatically respects Paystack `Retry-After` headers on rate limit responses.
- **Sophisticated Idempotency**: Built-in support for manual, static, or automatic UUID-based idempotency keys on POST requests.
- **Detailed Error Handling**: `PaystackApiError` includes `status`, `url`, and Paystack `requestId`.
- **Webhook Verification**: Timing-safe webhook signature verification helper included.

## Install

```bash
pnpm add @alexasomba/paystack-node
```

Authenticate requests with your Paystack secret key:

```ts
process.env.PAYSTACK_SECRET_KEY = "sk_test_...";
```

## Quick Start

```ts
import { createPaystack, assertOk } from "@alexasomba/paystack-node";

const paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
  idempotencyKey: "auto",
});

const result = await paystack.transaction_initialize({
  body: {
    email: "customer@example.com",
    amount: 5000,
  },
});

const data = assertOk(result);
console.log(data.authorization_url);
```

`assertOk` returns the successful Paystack payload and throws a structured `PaystackApiError` for non-2xx responses.

## API Basics

- Base URL: `https://api.paystack.co`
- HTTPS is required for all requests.
- Requests and responses are JSON-based.
- Most successful responses follow the `status`, `message`, `data`, and optional `meta` envelope described in `Paystack-API/0a-Introduction.md`.
- Amounts are usually sent in currency subunits such as kobo, pesewas, or cents. Check the module docs for currency-specific rules.

## Authentication & Environments

- Server-side SDKs should use your secret key (`sk_test_*` or `sk_live_*`).
- Browser SDKs should use only your public key (`pk_test_*` or `pk_live_*`).
- Send server-side API credentials as `Authorization: Bearer YOUR_SECRET_KEY`.
- Test and live modes use different keys and isolated environments.
- Rotate keys if they are exposed, and never commit secret keys to source control.
- If you enable IP whitelisting in Paystack, requests from non-whitelisted IPs will be blocked.

## Advanced Configuration

The `createPaystack` helper accepts `PaystackClientOptions`:

```ts
const paystack = createPaystack({
  secretKey: "sk_...",
  timeoutMs: 30_000,
  retry: {
    retries: 3,
    minDelayMs: 500,
    retryOnStatuses: [429, 500, 503],
  },
  idempotencyKey: "auto",
  headers: {
    "X-My-App": "v1.0.0",
  },
});
```

## Stable Type Exports

This SDK exports stable grouped client slices and curated request/query/response aliases so downstream integrations do not need to reconstruct types from `ReturnType<typeof createPaystack>`, `paths`, or `operations`.

```ts
import {
  createPaystack,
  type Paystack,
  type PaystackTransactionClient,
  type PaystackSubscriptionClient,
  type TransactionInitializePayload,
  type TransactionChargeAuthorizationPayload,
  type SubscriptionCreatePayload,
  type SubscriptionListQueryParams,
  type RefundCreatePayload,
} from "@alexasomba/paystack-node";

const paystack: Paystack = createPaystack({
  secretKey: process.env.PAYSTACK_SECRET_KEY!,
});

const transactionClient: PaystackTransactionClient = paystack.transaction;
const subscriptionClient: PaystackSubscriptionClient = paystack.subscription;

const tx: TransactionInitializePayload = {
  email: "customer@example.com",
  amount: 5000,
};

const chargeAuthorization: TransactionChargeAuthorizationPayload = {
  email: "customer@example.com",
  amount: 2500,
  authorization_code: "AUTH_123",
};

const subscriptionCreate: SubscriptionCreatePayload = {
  customer: "CUS_123",
  plan: "PLN_123",
};

const subscriptionList: SubscriptionListQueryParams = {
  customer: 123,
};

const refundCreate: RefundCreatePayload = {
  transaction: "TRX_123",
  amount: 1000,
};
```

Notable aliases include transaction initialize / charge authorization / verify; subscription create / list / disable / enable / fetch / manage link / manage email; customer fetch / create / update; plan list / create / update / fetch; product list / create / update / fetch; dispute list / fetch; refund create / fetch; payment request create / fetch; terminal send-event; and verification helpers for account resolution, account validation, and card BIN lookup.

Client slices include `PaystackTransactionClient`, `PaystackCustomerClient`, `PaystackSubscriptionClient`, `PaystackPlanClient`, `PaystackProductClient`, `PaystackDisputeClient`, and `PaystackRefundClient`.

Grouped methods reflect supported generated OpenAPI operations. Unsupported helpers such as `subscription.update` are intentionally not part of the public SDK surface.

### Webhooks

Use the webhook helper when validating server-to-server events from Paystack. Pass the raw request body, not a parsed JSON object.

```ts
import { verifyPaystackWebhookSignature } from "@alexasomba/paystack-node/webhooks";

const isValid = verifyPaystackWebhookSignature({
  rawBody: req.body,
  signature: req.headers["x-paystack-signature"],
  secret: process.env.PAYSTACK_SECRET_KEY!,
});
```

### Handling Pagination

List endpoints expose pagination controls through query params like `perPage`, `page`, `next`, and `previous`. Response headers are still available when you need manual pagination control.

## Pagination

- Paystack supports both offset pagination and cursor pagination.
- Offset pagination uses `page` and `perPage`.
- Cursor pagination uses `use_cursor=true` plus `next` or `previous` cursors returned in `meta`.
- Cursor pagination is especially useful for large or frequently changing datasets.
- The exact `meta` shape varies by endpoint and pagination mode.

```ts
const result = await paystack.customer_list({ query: { perPage: 20 } });
const customers = assertOk(result);
const total = result.response.headers.get("x-total-count");
```

## Error Handling

```ts
import { toPaystackApiError } from "@alexasomba/paystack-node";

const result = await paystack.transaction_initialize({
  /* ... */
});
const error = toPaystackApiError(result);

if (error) {
  console.error(`Status ${error.status}: ${error.message}`);
  console.error(`Paystack Request ID: ${error.requestId}`);
}
```

The `requestId` is useful when correlating logs or escalating an issue with Paystack support.

## Errors

- Paystack uses conventional HTTP status codes such as `200`, `201`, `400`, `401`, `404`, and `5xx`.
- Error responses typically include `status`, `message`, `type`, `code`, and optional diagnostic `meta` information.
- Error types described in `Paystack-API/0d-Errors.md` include `api_error`, `validation_error`, and `processor_error`.
- For charge and verify flows, always inspect the returned response body and status fields, not just the HTTP code.

## Coverage

This SDK is generated from the SDK spec in this monorepo and currently tracks the full set of generated typed operations for the Paystack-API-aligned contract.

## Modules

For this SDK, these schema families are exposed through generated TypeScript types in `src/openapi-types.ts` and operation helpers in `src/operations.ts`.

| Module                                                               | Schema / model family                                    |
| -------------------------------------------------------------------- | -------------------------------------------------------- |
| Transactions                                                         | `Transaction*`                                           |
| Verify Payments (Transaction verification)                           | `VerifyResponse / TransactionFetchResponse`              |
| Charges                                                              | `Charge*`                                                |
| Bulk Charges                                                         | `BulkCharge*`                                            |
| Subaccounts                                                          | `Subaccount*`                                            |
| Transaction Splits                                                   | `Split*`                                                 |
| Terminal                                                             | `Terminal*`                                              |
| Virtual Terminal                                                     | `VirtualTerminal*`                                       |
| Customers                                                            | `Customer*`                                              |
| Direct Debit                                                         | `DirectDebit*`                                           |
| Dedicated Virtual Accounts                                           | `DedicatedNuban* / DedicatedVirtualAccount*`             |
| Apple Pay                                                            | `ApplePay*`                                              |
| Plans                                                                | `Plan*`                                                  |
| Subscriptions                                                        | `Subscription*`                                          |
| Transfer Recipients                                                  | `TransferRecipient*`                                     |
| Transfers                                                            | `Transfer*`                                              |
| Transfers Control (OTP settings; under Transfers)                    | `TransferEnable* / TransferDisable* / TransferFinalize*` |
| Balance                                                              | `Balance*`                                               |
| Payment Requests (Invoices)                                          | `PaymentRequest*`                                        |
| Verification (Resolve Account / Validate Account / Resolve Card BIN) | `Verification*`                                          |
| Products                                                             | `Product*`                                               |
| Storefronts                                                          | `Storefront*`                                            |
| Orders                                                               | `Order*`                                                 |
| Payment Pages                                                        | `Page*`                                                  |
| Settlements                                                          | `Settlement*`                                            |
| Integration                                                          | `Integration*`                                           |
| Control Panel (Payment session timeout; under Integration)           | `ControlPanel*`                                          |
| Refunds                                                              | `Refund*`                                                |
| Disputes                                                             | `Dispute*`                                               |
| Banks                                                                | `Bank*`                                                  |
| Miscellaneous                                                        | `Miscellaneous* / Currency`                              |

## Module Examples

These are intentionally short examples. Use them as entry points, then expand the request bodies with the typed fields exposed by your editor and `src/openapi-types.ts`.

### Transactions

```ts
const tx = await paystack.transaction_initialize({
  body: { email: "customer@example.com", amount: 5000 },
});
```

### Verify Payments (Transaction verification)

```ts
const verified = await paystack.transaction_verify({
  params: { path: { reference: "ref_123" } },
});
```

### Charges

```ts
await paystack.charge_create({
  body: {
    email: "customer@example.com",
    amount: 5000,
    bank: { code: "057", account_number: "0001234567" },
  },
});
```

### Bulk Charges

```ts
await paystack.bulkCharge_initiate({
  body: [{ authorization: "AUTH_xxx", amount: 5000, reference: "bulk-ref-1" }],
});
```

### Subaccounts

```ts
await paystack.subaccount_create({
  body: {
    business_name: "Acme Stores",
    settlement_bank: "057",
    account_number: "0001234567",
    percentage_charge: 10,
  },
});
```

### Transaction Splits

```ts
await paystack.split_create({
  body: { name: "Main split", type: "percentage", currency: "NGN", subaccounts: [] },
});
```

### Terminal

```ts
const terminals = await paystack.terminal_list();
```

### Virtual Terminal

```ts
await paystack.virtualTerminal_create({
  body: { name: "Web checkout terminal" },
});
```

### Customers

```ts
await paystack.customer_create({
  body: { email: "customer@example.com", first_name: "Ada", last_name: "Lovelace" },
});
```

### Direct Debit

```ts
await paystack.directdebit_initialize({
  body: { email: "customer@example.com", amount: 5000, bank_code: "057" },
});
```

### Dedicated Virtual Accounts

```ts
await paystack.dedicatedAccount_assign({
  body: { customer: 12345, preferred_bank: "wema-bank" },
});
```

### Apple Pay

```ts
await paystack.applePay_registerDomain({
  body: { domainName: "example.com" },
});
```

### Plans

```ts
await paystack.plan_create({
  body: { name: "Starter", amount: 500000, interval: "monthly" },
});
```

### Subscriptions

```ts
await paystack.subscription_create({
  body: { customer: "CUS_xxx", plan: "PLN_xxx" },
});
```

### Transfer Recipients

```ts
await paystack.transferrecipient_create({
  body: {
    type: "nuban",
    name: "Ada Lovelace",
    account_number: "0001234567",
    bank_code: "057",
    currency: "NGN",
  },
});
```

### Transfers

```ts
await paystack.transfer_create({
  body: { source: "balance", amount: 5000, recipient: "RCP_xxx", reason: "Vendor payout" },
});
```

### Transfers Control (OTP settings; under Transfers)

```ts
await paystack.transfer_enableOtp();
```

### Balance

```ts
const balance = await paystack.balance_fetch();
```

### Payment Requests (Invoices)

```ts
await paystack.paymentRequest_create({
  body: { customer: "CUS_xxx", amount: 5000, description: "Consulting invoice" },
});
```

### Verification (Resolve Account / Validate Account / Resolve Card BIN)

```ts
await paystack.bank_resolveAccountNumber({
  params: { query: { account_number: "0001234567", bank_code: "057" } },
});
```

### Products

```ts
await paystack.product_create({
  body: { name: "T-shirt", description: "Cotton tee", price: 5000, currency: "NGN" },
});
```

### Storefronts

```ts
const storefronts = await paystack.storefront_list();
```

### Orders

```ts
await paystack.order_create({
  body: { customer: "CUS_xxx", items: [] },
});
```

### Payment Pages

```ts
await paystack.page_create({
  body: { name: "Event Ticket", amount: 5000, description: "Landing page for ticket sales" },
});
```

### Settlements

```ts
const settlements = await paystack.settlement_list();
```

### Integration

```ts
const timeout = await paystack.integration_fetchPaymentSessionTimeout();
```

### Control Panel (Payment session timeout; under Integration)

```ts
await paystack.integration_updatePaymentSessionTimeout({
  body: { timeout: 20 },
});
```

### Refunds

```ts
await paystack.refund_create({
  body: { transaction: 123456789, amount: 5000 },
});
```

### Disputes

```ts
const disputes = await paystack.dispute_list();
```

### Banks

```ts
const banks = await paystack.bank_list({ params: { query: { country: "nigeria" } } });
```

### Miscellaneous

```ts
const countries = await paystack.miscellaneous_listCountries();
```

## Related SDKs

- [@alexasomba/paystack-browser](https://github.com/alexasomba/paystack-browser) - Optimized for browser fetches.
- [@alexasomba/paystack-axios](https://github.com/alexasomba/paystack-axios) - For projects using Axios.

## Used By

- **[Better Auth Paystack Plugin](https://github.com/alexasomba/better-auth-paystack)**: A comprehensive Paystack plugin for Better Auth.

## Source

- Monorepo source: [alexasomba/paystack-openapi](https://github.com/alexasomba/paystack-openapi)
- Standalone SDK repo: [https://github.com/alexasomba/paystack-node](https://github.com/alexasomba/paystack-node)

## License

MIT
