import { describe, it, expect, vi, beforeEach } from "vite-plus/test";

import { createPaystack } from "../src/index.js";

describe("Module Coverage Tests", () => {
  const secretKey = "sk_test_123";
  const mockFetch = vi.fn();
  const paystack = createPaystack({ secretKey, fetch: mockFetch });

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ status: true, data: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  function assertCall(urlPart: string, method = "GET") {
    expect(mockFetch).toHaveBeenCalled();
    const [input, init] = mockFetch.mock.calls[0];
    const url = input instanceof Request ? input.url : String(input);
    const actualMethod = input instanceof Request ? input.method : (init?.method ?? "GET");
    expect(url).toContain(urlPart);
    expect(actualMethod.toUpperCase()).toBe(method.toUpperCase());
  }

  it("Charge module", async () => {
    await paystack.charge.create({ body: { email: "test@example.com", amount: 100 } });
    assertCall("/charge", "POST");
  });

  it("Customers module", async () => {
    await paystack.customer.create({ body: { email: "test@example.com", first_name: "John" } });
    assertCall("/customer", "POST");
  });

  it("Plans module", async () => {
    await paystack.plan.create({ body: { name: "Test Plan", amount: 5000, interval: "monthly" } });
    assertCall("/plan", "POST");
  });

  it("Products module", async () => {
    await paystack.product.create({
      body: { name: "Test Product", description: "desc", price: 1000, currency: "NGN" },
    });
    assertCall("/product", "POST");
  });

  it("Subscriptions module", async () => {
    await paystack.subscription.create({ body: { customer: "CUS_123", plan: "PLN_123" } });
    assertCall("/subscription", "POST");
  });

  it("Transactions module", async () => {
    await paystack.transaction.initialize({ body: { email: "test@example.com", amount: 1000 } });
    assertCall("/transaction/initialize", "POST");
  });

  it("Verify Payments module", async () => {
    await paystack.transaction.verify("REF_123");
    assertCall("/transaction/verify/REF_123", "GET");
  });

  it("Transfers module", async () => {
    await paystack.transfer.initiate({
      body: {
        source: "balance",
        amount: 1000,
        recipient: "RCP_123",
        reference: "REF_123",
        currency: "NGN",
      },
    });
    assertCall("/transfer", "POST");
  });

  it("Dedicated Virtual Accounts module", async () => {
    await paystack.dedicatedAccount.create({
      body: { customer: "CUS_123", preferred_bank: "test-bank" },
    });
    assertCall("/dedicated_account", "POST");
  });

  it("Apple Pay module", async () => {
    await paystack.applePay.listDomain();
    assertCall("/apple-pay/domain", "GET");
  });

  it("Subaccounts module", async () => {
    await paystack.subaccount.create({
      body: {
        business_name: "Test Biz",
        settlement_bank: "Bank",
        account_number: "123",
        percentage_charge: 10,
      },
    });
    assertCall("/subaccount", "POST");
  });

  it("Transaction Splits module", async () => {
    await paystack.split.create({
      body: { name: "Split", type: "percentage", currency: "NGN", subaccounts: [] },
    });
    assertCall("/split", "POST");
  });

  it("Settlements module", async () => {
    await paystack.settlements.fetch();
    assertCall("/settlement", "GET");
  });

  it("Transfers Control module", async () => {
    await paystack.transfer.enableOtp();
    assertCall("/transfer/enable_otp", "POST");
  });

  it("Transfer Recipients module", async () => {
    await paystack.transferrecipient.create({
      body: { type: "nuban", name: "John", account_number: "123", bank_code: "011" },
    });
    assertCall("/transferrecipient", "POST");
  });

  it("Bulk Charges module", async () => {
    await paystack.bulkCharge.initiate({ body: [] });
    assertCall("/bulkcharge", "POST");
  });

  it("Refunds module", async () => {
    await paystack.refund.create({ body: { transaction: "TRX_123", amount: 100 } });
    assertCall("/refund", "POST");
  });

  it("Verification module", async () => {
    await paystack.bank.resolveAccountNumber({
      params: { query: { account_number: "123", bank_code: "111" } },
    });
    assertCall("/bank/resolve", "GET");
  });

  it("Miscellaneous module", async () => {
    await paystack.miscellaneous.listCountries();
    assertCall("/country", "GET");
  });

  it("Disputes module", async () => {
    await paystack.dispute.list();
    assertCall("/dispute", "GET");
  });

  it("Control Panel module", async () => {
    await paystack.integration.fetchPaymentSessionTimeout();
    assertCall("/integration/payment_session_timeout", "GET");
  });

  it("Terminal module", async () => {
    await paystack.terminal.list();
    assertCall("/terminal", "GET");
  });

  it("Virtual Terminal module", async () => {
    await paystack.virtualTerminal.list();
    assertCall("/virtual_terminal", "GET");
  });

  it("Direct Debit module", async () => {
    await paystack.directdebit.listMandateAuthorizations();
    assertCall("/directdebit", "GET");
  });

  it("Payment Pages module", async () => {
    await paystack.page.create({ body: { name: "Page", amount: 1000 } });
    assertCall("/page", "POST");
  });

  it("Payment Requests module", async () => {
    await paystack.paymentRequest.create({ body: { customer: "CUS_123", amount: 1000 } });
    assertCall("/paymentrequest", "POST");
  });

  it("Integration module", async () => {
    await paystack.integration.fetchPaymentSessionTimeout();
    assertCall("/integration/payment_session_timeout", "GET");
  });

  it("Balance module", async () => {
    await paystack.balance.fetch();
    assertCall("/balance", "GET");
  });

  it("Banks module", async () => {
    await paystack.bank.list();
    assertCall("/bank", "GET");
  });

  it("Orders module", async () => {
    await paystack.order.list();
    assertCall("/order", "GET");
  });

  it("Storefronts module", async () => {
    await paystack.storefront.list();
    assertCall("/storefront", "GET");
  });
});
