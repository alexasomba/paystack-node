import { describe, expect, it, vi } from "vite-plus/test";

import { createPaystack, type Paystack } from "../src/index.js";
import type {
  PaymentRequestCreatePayload,
  ResolveAccountNumberQueryParams,
  SubaccountCreatePayload,
  TerminalSendEventPayload,
  TransactionInitializePayload,
  TransactionVerifyPathParams,
} from "../src/index.js";
import type { PaymentNotificationWebhookEvent } from "../src/webhooks.js";

describe("Public type exports", () => {
  it("keep representative aliases importable and assignable", () => {
    const paystack: Paystack = createPaystack({
      secretKey: "sk_test_123",
      fetch: vi.fn() as typeof fetch,
    });

    const txPayload: TransactionInitializePayload = {
      email: "customer@example.com",
      amount: 5000,
    };
    const verifyParams: TransactionVerifyPathParams = { reference: "ref_123" };
    const paymentRequest: PaymentRequestCreatePayload = {
      customer: "CUS_123",
      amount: 10000,
    };
    const terminalEvent: TerminalSendEventPayload = {
      type: "invoice",
      action: "process",
    };
    const resolveAccount: ResolveAccountNumberQueryParams = {
      account_number: "0123456789",
      bank_code: "058",
    };
    const subaccount: SubaccountCreatePayload = {
      business_name: "Test Biz",
      settlement_bank: "058",
      account_number: "0123456789",
      percentage_charge: 10,
    };
    const webhookEvent: PaymentNotificationWebhookEvent = {
      event: "invoice.create",
      data: {} as PaymentNotificationWebhookEvent["data"],
    };

    expect(paystack.paymentRequest.create).toBeTypeOf("function");
    expect(txPayload.amount).toBe(5000);
    expect(verifyParams.reference).toBe("ref_123");
    expect(paymentRequest.customer).toBe("CUS_123");
    expect(terminalEvent.type).toBe("invoice");
    expect(resolveAccount.bank_code).toBe("058");
    expect(subaccount.business_name).toBe("Test Biz");
    expect(webhookEvent.event).toBe("invoice.create");
  });
});
