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

export type PaystackOperations = ReturnType<typeof bindOperations>;

export interface Paystack extends PaystackOperations {
  client: PaystackClient;
}

// Transactions
export type TransactionInitializePayload = JsonRequestBody<operations["transaction_initialize"]>;
export type TransactionInitializeResponsePayload = JsonSuccessResponseBody<
  operations["transaction_initialize"]
>;
export type TransactionInitializeResponseData = TransactionInitializeResponsePayload["data"];

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
export type SubscriptionFetchPathParams = PathParams<operations["subscription_fetch"]>;
export type SubscriptionFetchResponsePayload = JsonSuccessResponseBody<
  operations["subscription_fetch"]
>;
export type SubscriptionFetchResponseData = SubscriptionFetchResponsePayload["data"];

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
export type PlanFetchPathParams = PathParams<operations["plan_fetch"]>;
export type PlanFetchResponsePayload = JsonSuccessResponseBody<operations["plan_fetch"]>;
export type PlanFetchResponseData = PlanFetchResponsePayload["data"];

export type ProductFetchPathParams = PathParams<operations["product_fetch"]>;
export type ProductFetchResponsePayload = JsonSuccessResponseBody<operations["product_fetch"]>;
export type ProductFetchResponseData = ProductFetchResponsePayload["data"];

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
