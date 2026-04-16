export * from "./client.js";
export * from "./operations.js";
export * from "./webhooks.js";
export * from "./idempotency.js";
export * from "./errors.js";
export * from "./response.js";
export * from "./types.js";
export type { paths, operations, components } from "./openapi-types.js";

import { createPaystackClient, type PaystackClientOptions } from "./client.js";
import { bindOperations } from "./operations.js";
import type { Paystack } from "./types.js";

export function createPaystack(options: PaystackClientOptions): Paystack {
  const client = createPaystackClient(options);
  return { client, ...bindOperations(client) };
}
