import { describe, expect, it, vi } from "vite-plus/test";

import { createPaystack, type Paystack } from "../src/index.js";
import type {
  CustomerCreatePayload,
  CustomerFetchPathParams,
  DisputeFetchPathParams,
  DisputeListQueryParams,
  CustomerUpdatePathParams,
  CustomerUpdatePayload,
  PaymentRequestCreatePayload,
  PaystackCustomerClient,
  PaystackDisputeClient,
  PaystackPlanClient,
  PaystackProductClient,
  PaystackRefundClient,
  PaystackSubscriptionClient,
  PaystackTransactionClient,
  PlanCreatePayload,
  PlanListQueryParams,
  PlanUpdatePathParams,
  PlanUpdatePayload,
  ProductCreatePayload,
  ProductListQueryParams,
  ProductUpdatePathParams,
  ProductUpdatePayload,
  ResolveAccountNumberQueryParams,
  RefundCreatePayload,
  RefundFetchPathParams,
  SubscriptionDisablePayload,
  SubscriptionEnablePayload,
  SubscriptionCreatePayload,
  SubscriptionListQueryParams,
  SubaccountCreatePayload,
  TerminalSendEventPayload,
  TransactionChargeAuthorizationPayload,
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
    const chargeAuthorization: TransactionChargeAuthorizationPayload = {
      email: "customer@example.com",
      amount: 2500,
      authorization_code: "AUTH_123",
    };
    const verifyParams: TransactionVerifyPathParams = { reference: "ref_123" };
    const paymentRequest: PaymentRequestCreatePayload = {
      customer: "CUS_123",
      amount: 10000,
    };
    const subscriptionCreate: SubscriptionCreatePayload = {
      customer: "CUS_123",
      plan: "PLN_123",
    };
    const subscriptionList: SubscriptionListQueryParams = { customer: 123, plan: 456 };
    const subscriptionDisable: SubscriptionDisablePayload = {
      code: "SUB_123",
      token: "email_token",
    };
    const subscriptionEnable: SubscriptionEnablePayload = {
      code: "SUB_123",
      token: "email_token",
    };
    const customerCreate: CustomerCreatePayload = {
      email: "customer@example.com",
      first_name: "Ada",
    };
    const customerFetchParams: CustomerFetchPathParams = { email_or_code: "CUS_123" };
    const customerUpdateParams: CustomerUpdatePathParams = { email_or_code: "CUS_123" };
    const customerUpdate: CustomerUpdatePayload = { first_name: "Ada" };
    const planCreate: PlanCreatePayload = {
      name: "Starter",
      amount: 5000,
      interval: "monthly",
    };
    const planList: PlanListQueryParams = { status: "active" };
    const planUpdateParams: PlanUpdatePathParams = { id_or_code: "PLN_123" };
    const planUpdate: PlanUpdatePayload = { name: "Starter Plus" };
    const productCreate: ProductCreatePayload = {
      name: "Pro",
      description: "Higher tier",
      price: 15000,
      currency: "NGN",
    };
    const productList: ProductListQueryParams = { perPage: 10 };
    const productUpdateParams: ProductUpdatePathParams = { id: 123 };
    const productUpdate: ProductUpdatePayload = { name: "Pro Plus" };
    const disputeList: DisputeListQueryParams = { status: "pending" };
    const disputeFetchParams: DisputeFetchPathParams = { id: 123 };
    const refundCreate: RefundCreatePayload = { transaction: "TRX_123", amount: 1000 };
    const refundFetchParams: RefundFetchPathParams = { id: 123 };
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
    const transactionClient: PaystackTransactionClient = paystack.transaction;
    const customerClient: PaystackCustomerClient = paystack.customer;
    const subscriptionClient: PaystackSubscriptionClient = paystack.subscription;
    const planClient: PaystackPlanClient = paystack.plan;
    const productClient: PaystackProductClient = paystack.product;
    const disputeClient: PaystackDisputeClient = paystack.dispute;
    const refundClient: PaystackRefundClient = paystack.refund;

    expect(paystack.paymentRequest.create).toBeTypeOf("function");
    expect(paystack.customer.update).toBeTypeOf("function");
    expect(paystack.plan.update).toBeTypeOf("function");
    expect(paystack.product.update).toBeTypeOf("function");
    expect("update" in paystack.subscription).toBe(false);
    expect(txPayload.amount).toBe(5000);
    expect(chargeAuthorization.authorization_code).toBe("AUTH_123");
    expect(verifyParams.reference).toBe("ref_123");
    expect(paymentRequest.customer).toBe("CUS_123");
    expect(subscriptionCreate.plan).toBe("PLN_123");
    expect(subscriptionList.customer).toBe(123);
    expect(subscriptionDisable.code).toBe("SUB_123");
    expect(subscriptionEnable.token).toBe("email_token");
    expect(customerCreate.email).toBe("customer@example.com");
    expect(customerFetchParams.email_or_code).toBe("CUS_123");
    expect(customerUpdateParams.email_or_code).toBe("CUS_123");
    expect(customerUpdate.first_name).toBe("Ada");
    expect(planList.status).toBe("active");
    expect(planCreate.interval).toBe("monthly");
    expect(planUpdateParams.id_or_code).toBe("PLN_123");
    expect(planUpdate.name).toBe("Starter Plus");
    expect(productList.perPage).toBe(10);
    expect(productCreate.currency).toBe("NGN");
    expect(productUpdateParams.id).toBe(123);
    expect(productUpdate.name).toBe("Pro Plus");
    expect(disputeList.status).toBe("pending");
    expect(disputeFetchParams.id).toBe(123);
    expect(refundCreate.transaction).toBe("TRX_123");
    expect(refundFetchParams.id).toBe(123);
    expect(terminalEvent.type).toBe("invoice");
    expect(resolveAccount.bank_code).toBe("058");
    expect(subaccount.business_name).toBe("Test Biz");
    expect(webhookEvent.event).toBe("invoice.create");
    expect(transactionClient.initialize).toBeTypeOf("function");
    expect(customerClient.fetch).toBeTypeOf("function");
    expect(subscriptionClient.disable).toBeTypeOf("function");
    expect(planClient.list).toBeTypeOf("function");
    expect(productClient.list).toBeTypeOf("function");
    expect(disputeClient.list).toBeTypeOf("function");
    expect(refundClient.create).toBeTypeOf("function");

    // @ts-expect-error subscription.update is not part of the generated SDK surface
    const subscriptionUpdate = paystack.subscription.update;
    void subscriptionUpdate;
  });
});
