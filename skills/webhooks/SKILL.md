---
name: webhooks
description: Use when verifying, parsing, and handling Paystack webhooks with @alexasomba/paystack-node.
license: MIT
compatibility: "Node.js >=22.0.0; ESM-only package; backend/server runtime; imports @alexasomba/paystack-node and @alexasomba/paystack-node/webhooks."
---

# Paystack Node Webhooks

## License and compatibility

- License: MIT, same as `@alexasomba/paystack-node`.
- Runtime compatibility: Node.js >=22.0.0; ESM-only package with `type: "module"`.
- Supported import paths: `@alexasomba/paystack-node` and `@alexasomba/paystack-node/webhooks`.
- Intended environment: backend/server runtimes. Do not bundle this SDK into browser code because it uses Paystack secret keys.

Webhook handling must run on the server with your Paystack secret key. Verify the raw body before trusting the event.

## Verify signatures

```ts
import { Webhooks } from "@alexasomba/paystack-node";

const isValid = Webhooks.verifySignature(
  rawBody,
  request.headers["x-paystack-signature"],
  process.env.PAYSTACK_SECRET_KEY!,
);

if (!isValid) {
  throw new Error("Invalid Paystack webhook signature");
}
```

Pass the exact raw request body string used to compute the HMAC. Do not verify a parsed and reserialized JSON object.

## Parse events

```ts
const event = Webhooks.parseEvent(rawBody);

switch (event.event) {
  case "charge.success":
    break;
  default:
    break;
}
```

## Best practices

- Configure your framework to expose the raw request body for the webhook route.
- Verify the signature before parsing or acting on the payload.
- Make handlers idempotent; Paystack may retry webhook delivery.
- Respond quickly and move slow fulfillment work to a queue.
- Re-verify critical transactions with the API before delivering irreversible value.
