import { describe, it, expect } from "vite-plus/test";

import { createPaystackClient } from "../src/client.js";

describe("PaystackClient", () => {
  it("should initialize correctly", () => {
    const client = createPaystackClient({ secretKey: "sk_test_123" });
    expect(client).toBeDefined();
  });
});
