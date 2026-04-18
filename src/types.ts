import type { PaystackClient } from "./client.js";
import type { operations } from "./openapi-types.js";
import type { bindOperations } from "./operations.js";

type JsonRequestBody<TOperation> = TOperation extends {
  requestBody?: { content: { "application/json": infer TBody } };
}
  ? TBody
  : never;

type JsonResponseBody<
  TOperation extends { responses: Record<PropertyKey, unknown> },
  TStatus extends keyof TOperation["responses"],
> = TOperation["responses"][TStatus] extends {
  content: { "application/json": infer TBody };
}
  ? TBody
  : never;

type PathParams<TOperation> = TOperation extends {
  parameters: { path: infer TPath };
}
  ? TPath
  : never;

type QueryParams<TOperation> = TOperation extends {
  parameters: { query?: infer TQuery };
}
  ? TQuery
  : never;

type SuccessStatus<
  TResponses extends Record<PropertyKey, unknown>,
  TPreferred extends PropertyKey = 200,
> = TPreferred extends keyof TResponses
  ? TPreferred
  : Extract<keyof TResponses, 200 | 201 | 202 | 204>;

type JsonSuccessResponseBody<
  TOperation extends { responses: Record<PropertyKey, unknown> },
  TPreferred extends PropertyKey = 200,
> = JsonResponseBody<TOperation, SuccessStatus<TOperation["responses"], TPreferred>>;

type PayloadData<TPayload> = TPayload extends { data: infer TData } ? TData : never;

export type PaystackOperations = ReturnType<typeof bindOperations>;

export interface Paystack extends PaystackOperations {
  client: PaystackClient;
}

export type PaystackTransactionClient = Paystack["transaction"];
export type PaystackCustomerClient = Paystack["customer"];
export type PaystackSubscriptionClient = Paystack["subscription"];
export type PaystackPlanClient = Paystack["plan"];
export type PaystackProductClient = Paystack["product"];
export type PaystackDisputeClient = Paystack["dispute"];
export type PaystackRefundClient = Paystack["refund"];

// Transactions
export type TransactionInitializePayload = JsonRequestBody<operations["transaction_initialize"]>;
export type TransactionInitializeResponsePayload = JsonSuccessResponseBody<
  operations["transaction_initialize"]
>;
export type TransactionInitializeResponseData = TransactionInitializeResponsePayload["data"];

export type TransactionChargeAuthorizationPayload = JsonRequestBody<
  operations["transaction_chargeAuthorization"]
>;
export type TransactionChargeAuthorizationResponsePayload = JsonSuccessResponseBody<
  operations["transaction_chargeAuthorization"]
>;
export type TransactionChargeAuthorizationResponseData =
  TransactionChargeAuthorizationResponsePayload["data"];

export type TransactionVerifyPathParams = PathParams<operations["transaction_verify"]>;
export type TransactionVerifyResponsePayload = JsonSuccessResponseBody<
  operations["transaction_verify"]
>;
export type TransactionVerifyResponseData = TransactionVerifyResponsePayload["data"];

// Verification
export type ResolveAccountNumberQueryParams = QueryParams<operations["bank_resolveAccountNumber"]>;
export type ResolveAccountNumberResponsePayload = JsonSuccessResponseBody<
  operations["bank_resolveAccountNumber"]
>;
export type ResolveAccountNumberResponseData = ResolveAccountNumberResponsePayload["data"];

export type ValidateAccountNumberPayload = JsonRequestBody<
  operations["bank_validateAccountNumber"]
>;
export type ValidateAccountNumberResponsePayload = JsonSuccessResponseBody<
  operations["bank_validateAccountNumber"]
>;
export type ValidateAccountNumberResponseData = ValidateAccountNumberResponsePayload["data"];

export type ResolveCardBinPathParams = PathParams<operations["miscellaneous_resolveCardBin"]>;
export type ResolveCardBinResponsePayload = JsonSuccessResponseBody<
  operations["miscellaneous_resolveCardBin"]
>;
export type ResolveCardBinResponseData = ResolveCardBinResponsePayload["data"];

// Subscriptions
export type SubscriptionCreatePayload = JsonRequestBody<operations["subscription_create"]>;
export type SubscriptionCreateResponsePayload = JsonSuccessResponseBody<
  operations["subscription_create"]
>;
export type SubscriptionCreateResponseData = SubscriptionCreateResponsePayload["data"];

export type SubscriptionListQueryParams = QueryParams<operations["subscription_list"]>;
export type SubscriptionListResponsePayload = JsonSuccessResponseBody<
  operations["subscription_list"]
>;
export type SubscriptionListResponseData = SubscriptionListResponsePayload["data"];

export type SubscriptionFetchPathParams = PathParams<operations["subscription_fetch"]>;
export type SubscriptionFetchResponsePayload = JsonSuccessResponseBody<
  operations["subscription_fetch"]
>;
export type SubscriptionFetchResponseData = SubscriptionFetchResponsePayload["data"];

export type SubscriptionDisablePayload = JsonRequestBody<operations["subscription_disable"]>;
export type SubscriptionDisableResponsePayload = JsonSuccessResponseBody<
  operations["subscription_disable"]
>;
export type SubscriptionDisableResponseData = PayloadData<SubscriptionDisableResponsePayload>;

export type SubscriptionEnablePayload = JsonRequestBody<operations["subscription_enable"]>;
export type SubscriptionEnableResponsePayload = JsonSuccessResponseBody<
  operations["subscription_enable"]
>;
export type SubscriptionEnableResponseData = SubscriptionEnableResponsePayload["data"];

export type SubscriptionManageLinkPathParams = PathParams<operations["subscription_manageLink"]>;
export type SubscriptionManageLinkResponsePayload = JsonSuccessResponseBody<
  operations["subscription_manageLink"]
>;
export type SubscriptionManageLinkResponseData = SubscriptionManageLinkResponsePayload["data"];

export type SubscriptionManageEmailPathParams = PathParams<operations["subscription_manageEmail"]>;
export type SubscriptionManageEmailResponsePayload = JsonSuccessResponseBody<
  operations["subscription_manageEmail"]
>;
export type SubscriptionManageEmailResponseData = SubscriptionManageEmailResponsePayload["data"];

// Catalog and resources
export type CustomerCreatePayload = JsonRequestBody<operations["customer_create"]>;
export type CustomerCreateResponsePayload = JsonSuccessResponseBody<operations["customer_create"]>;
export type CustomerCreateResponseData = CustomerCreateResponsePayload["data"];

export type CustomerFetchPathParams = PathParams<operations["customer_fetch"]>;
export type CustomerFetchResponsePayload = JsonSuccessResponseBody<operations["customer_fetch"]>;
export type CustomerFetchResponseData = CustomerFetchResponsePayload["data"];

export type CustomerUpdatePathParams = PathParams<operations["customer_update"]>;
export type CustomerUpdatePayload = JsonRequestBody<operations["customer_update"]>;
export type CustomerUpdateResponsePayload = JsonSuccessResponseBody<operations["customer_update"]>;
export type CustomerUpdateResponseData = CustomerUpdateResponsePayload["data"];

export type PlanCreatePayload = JsonRequestBody<operations["plan_create"]>;
export type PlanCreateResponsePayload = JsonSuccessResponseBody<operations["plan_create"]>;
export type PlanCreateResponseData = PlanCreateResponsePayload["data"];

export type PlanListQueryParams = QueryParams<operations["plan_list"]>;
export type PlanListResponsePayload = JsonSuccessResponseBody<operations["plan_list"]>;
export type PlanListResponseData = PlanListResponsePayload["data"];

export type PlanFetchPathParams = PathParams<operations["plan_fetch"]>;
export type PlanFetchResponsePayload = JsonSuccessResponseBody<operations["plan_fetch"]>;
export type PlanFetchResponseData = PlanFetchResponsePayload["data"];

export type PlanUpdatePathParams = PathParams<operations["plan_update"]>;
export type PlanUpdatePayload = JsonRequestBody<operations["plan_update"]>;
export type PlanUpdateResponsePayload = JsonSuccessResponseBody<operations["plan_update"]>;
export type PlanUpdateResponseData = PayloadData<PlanUpdateResponsePayload>;

export type ProductCreatePayload = JsonRequestBody<operations["product_create"]>;
export type ProductCreateResponsePayload = JsonSuccessResponseBody<operations["product_create"]>;
export type ProductCreateResponseData = ProductCreateResponsePayload["data"];

export type ProductListQueryParams = QueryParams<operations["product_list"]>;
export type ProductListResponsePayload = JsonSuccessResponseBody<operations["product_list"]>;
export type ProductListResponseData = ProductListResponsePayload["data"];

export type ProductFetchPathParams = PathParams<operations["product_fetch"]>;
export type ProductFetchResponsePayload = JsonSuccessResponseBody<operations["product_fetch"]>;
export type ProductFetchResponseData = ProductFetchResponsePayload["data"];

export type ProductUpdatePathParams = PathParams<operations["product_update"]>;
export type ProductUpdatePayload = JsonRequestBody<operations["product_update"]>;
export type ProductUpdateResponsePayload = JsonSuccessResponseBody<operations["product_update"]>;
export type ProductUpdateResponseData = ProductUpdateResponsePayload["data"];

// Disputes and refunds
export type DisputeListQueryParams = QueryParams<operations["dispute_list"]>;
export type DisputeListResponsePayload = JsonSuccessResponseBody<operations["dispute_list"]>;
export type DisputeListResponseData = DisputeListResponsePayload["data"];

export type DisputeFetchPathParams = PathParams<operations["dispute_fetch"]>;
export type DisputeFetchResponsePayload = JsonSuccessResponseBody<operations["dispute_fetch"]>;
export type DisputeFetchResponseData = DisputeFetchResponsePayload["data"];

export type RefundCreatePayload = JsonRequestBody<operations["refund_create"]>;
export type RefundCreateResponsePayload = JsonSuccessResponseBody<operations["refund_create"]>;
export type RefundCreateResponseData = RefundCreateResponsePayload["data"];

export type RefundFetchPathParams = PathParams<operations["refund_fetch"]>;
export type RefundFetchResponsePayload = JsonSuccessResponseBody<operations["refund_fetch"]>;
export type RefundFetchResponseData = RefundFetchResponsePayload["data"];

export type SplitFetchPathParams = PathParams<operations["split_fetch"]>;
export type SplitFetchResponsePayload = JsonSuccessResponseBody<operations["split_fetch"]>;
export type SplitFetchResponseData = SplitFetchResponsePayload["data"];

export type SubaccountCreatePayload = JsonRequestBody<operations["subaccount_create"]>;
export type SubaccountCreateResponsePayload = JsonSuccessResponseBody<
  operations["subaccount_create"]
>;
export type SubaccountCreateResponseData = SubaccountCreateResponsePayload["data"];

export type SubaccountFetchPathParams = PathParams<operations["subaccount_fetch"]>;
export type SubaccountFetchResponsePayload = JsonSuccessResponseBody<
  operations["subaccount_fetch"]
>;
export type SubaccountFetchResponseData = SubaccountFetchResponsePayload["data"];

// Terminals
export type TerminalFetchPathParams = PathParams<operations["terminal_fetch"]>;
export type TerminalFetchResponsePayload = JsonSuccessResponseBody<operations["terminal_fetch"]>;
export type TerminalFetchResponseData = TerminalFetchResponsePayload["data"];

export type TerminalSendEventPathParams = PathParams<operations["terminal_sendEvent"]>;
export type TerminalSendEventPayload = JsonRequestBody<operations["terminal_sendEvent"]>;
export type TerminalSendEventResponsePayload = JsonSuccessResponseBody<
  operations["terminal_sendEvent"]
>;
export type TerminalSendEventResponseData = TerminalSendEventResponsePayload["data"];

export type VirtualTerminalFetchPathParams = PathParams<operations["virtualTerminal_fetch"]>;
export type VirtualTerminalFetchResponsePayload = JsonSuccessResponseBody<
  operations["virtualTerminal_fetch"]
>;
export type VirtualTerminalFetchResponseData = VirtualTerminalFetchResponsePayload["data"];

// Payment requests
export type PaymentRequestCreatePayload = JsonRequestBody<operations["paymentRequest_create"]>;
export type PaymentRequestCreateResponsePayload = JsonSuccessResponseBody<
  operations["paymentRequest_create"]
>;
export type PaymentRequestCreateResponseData = PaymentRequestCreateResponsePayload["data"];

export type PaymentRequestFetchPathParams = PathParams<operations["paymentRequest_fetch"]>;
export type PaymentRequestFetchResponsePayload = JsonSuccessResponseBody<
  operations["paymentRequest_fetch"]
>;
export type PaymentRequestFetchResponseData = PaymentRequestFetchResponsePayload["data"];
