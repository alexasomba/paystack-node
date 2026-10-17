[English](README.md) · [Español](README.es-ES.md) · [Français](README.fr-FR.md)

# @alexasomba/paystack-node

[![npm version](https://img.shields.io/npm/v/@alexasomba/paystack-node.svg)](https://www.npmjs.com/package/@alexasomba/paystack-node)
[![license](https://img.shields.io/npm/l/@alexasomba/paystack-node.svg)](https://github.com/alexasomba/paystack-node/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alexasomba/paystack-node)](https://bundlephobia.com/package/@alexasomba/paystack-node)

Cliente de la API de Paystack para Node.js, diseñado principalmente para TypeScript y generado a partir de la especificación oficial OpenAPI de Paystack.

## Características

- **Precisión basada en especificaciones**: Generado directamente a partir de la especificación OpenAPI de Paystack.
- **100% seguro en cuanto a tipos (Type-safe)**: Compatibilidad total con TypeScript, incluyendo tipos generados para cada endpoint, solicitud y respuesta.
- **Reintentos inteligentes**: Reintentos automáticos ante fallos transitorios, utilizando retroceso exponencial (_exponential backoff_) y aleatorización (_jitter_).
- **Cumplimiento de Retry-After**: Respeta automáticamente las cabeceras `Retry-After` de Paystack en las respuestas de límite de solicitudes.
- **Idempotencia avanzada**: Soporte integrado para claves de idempotencia —ya sean manuales, estáticas o automáticas (basadas en UUID)— en solicitudes POST.
- **Gestión detallada de errores**: `PaystackError` conserva los campos `code`, `type` y `meta` de Paystack, junto con el ID de solicitud, el estado HTTP y el cuerpo de la respuesta sin procesar.
- **Verificación de webhooks**: Incluye una utilidad para verificar firmas de webhooks de forma segura frente a ataques de temporización (_timing attacks_).

## Instalación

```bash
pnpm add @alexasomba/paystack-node
```

## Funciones para agentes (Agent Skills)

Este paquete incluye funciones de TanStack Intent para la integración con Paystack asistida por agentes:

```bash
npx @tanstack/intent@latest list
npx @tanstack/intent@latest install --map
npx @tanstack/intent@latest load @alexasomba/paystack-node#paystack-node-api-operations
```

Entre las funciones útiles se encuentran `paystack-node-client-setup`, `paystack-node-api-operations`, `paystack-node-operation-discovery`, `paystack-node-typed-payloads`, `paystack-node-responses-errors`, `paystack-node-retries-idempotency`, `paystack-node-transport-testing` y `paystack-node-webhooks`.

Autentica las solicitudes utilizando tu clave secreta de Paystack:

```ts
process.env.PAYSTACK_SECRET_KEY = "sk_test_...";
```

## Inicio rápido

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

`assertOk` devuelve la carga útil (payload) exitosa de Paystack y genera un objeto estructurado `PaystackError` en caso de respuestas que no sean de tipo 2xx, o bien devuelve envoltorios (envelopes) de tipo `{ status: false }`.

## Conceptos básicos de la API

- URL base: `https://api.paystack.co`
- Se requiere HTTPS para todas las solicitudes.
- Tanto las solicitudes como las respuestas están basadas en formato JSON.
- La mayoría de las respuestas exitosas siguen la estructura de envoltorio (envelope) compuesta por `status`, `message`, `data` y, opcionalmente, `meta`, tal como se describe en `Paystack-API/0a-Introduction.md`.
- Los importes suelen enviarse en subunidades monetarias, como kobo, pesewas o céntimos. Consulta la documentación del módulo para conocer las reglas específicas de cada moneda.

## Autenticación y entornos

- Los SDK del lado del servidor deben utilizar tu clave secreta (`sk_test_*` o `sk_live_*`).
- Los SDK para navegador deben utilizar únicamente tu clave pública (`pk_test_*` o `pk_live_*`).
- Envía las credenciales de la API del lado del servidor como `Authorization: Bearer YOUR_SECRET_KEY`.
- Los modos de prueba (test) y de producción (live) utilizan claves diferentes y entornos aislados.
- Rota las claves si se ven comprometidas y nunca incluyas claves secretas en el control de versiones (repositorio de código).
- Si habilitas la lista blanca de direcciones IP en Paystack, las solicitudes provenientes de direcciones IP que no estén en dicha lista serán bloqueadas.

## Configuración avanzada

El componente auxiliar `createPaystack` acepta `PaystackClientOptions`:

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

## Exportación de tipos estables

Este SDK exporta conjuntos estables de tipos (slices) y alias seleccionados para solicitudes, consultas y respuestas, de modo que las integraciones posteriores no necesiten reconstruir los tipos a partir de `ReturnType<typeof createPaystack>`, `paths` o `operations`.

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

Entre los alias más destacados se incluyen: inicialización de transacciones / autorización de cargos / verificación; creación, listado, desactivación, activación, obtención o gestión (mediante enlace o correo electrónico) de suscripciones; obtención, creación o actualización de clientes; listado, creación, actualización u obtención de planes; listado, creación, actualización u obtención de productos; listado u obtención de disputas; creación u obtención de reembolsos; creación u obtención de solicitudes de pago; y envío de eventos a terminales. y herramientas de verificación para la resolución de cuentas, la validación de cuentas y la consulta de BIN de tarjetas.

Los segmentos de cliente incluyen `PaystackTransactionClient`, `PaystackCustomerClient`, `PaystackSubscriptionClient`, `PaystackPlanClient`, `PaystackProductClient`, `PaystackDisputeClient` y `PaystackRefundClient`.

Los métodos agrupados corresponden a las operaciones de OpenAPI generadas y admitidas. Los elementos auxiliares no compatibles, como `subscription.update`, han sido excluidos deliberadamente de la interfaz pública del SDK.

### Webhooks

Utilice el elemento auxiliar para webhooks al validar eventos de servidor a servidor provenientes de Paystack. Proporcione el cuerpo de la solicitud en su formato original (raw), no como un objeto JSON analizado (parseado).

```ts
import { verifyPaystackWebhookSignature } from "@alexasomba/paystack-node/webhooks";

const isValid = verifyPaystackWebhookSignature({
  rawBody: req.body,
  signature: req.headers["x-paystack-signature"],
  secret: process.env.PAYSTACK_SECRET_KEY!,
});
```

### Gestión de la paginación

Los endpoints de listado ofrecen controles de paginación a través de parámetros de consulta (query params) como `perPage`, `page`, `next` y `previous`. Asimismo, los encabezados de respuesta siguen estando disponibles si necesita realizar una gestión manual de la paginación.

## Paginación

- Paystack admite tanto la paginación basada en desplazamiento (offset) como la paginación basada en punteros (cursor).
- La paginación por desplazamiento utiliza `page` y `perPage`.
- La paginación por punteros utiliza `use_cursor=true`, junto con los punteros `next` o `previous`, los cuales se devuelven en `meta`.
- La paginación por punteros resulta especialmente útil para conjuntos de datos extensos o que cambian con frecuencia.
- La estructura exacta de `meta` varía según el endpoint y el modo de paginación utilizado.

```ts
const result = await paystack.customer_list({ query: { perPage: 20 } });
const customers = assertOk(result);
const total = result.response.headers.get("x-total-count");
```

## Gestión de errores

```ts
import { toPaystackApiError } from "@alexasomba/paystack-node";

const result = await paystack.transaction_initialize({/* ... */});
const error = toPaystackApiError(result);

if (error) {
  console.error(`Status ${error.status}: ${error.message}`);
  console.error(`Paystack code: ${error.code}`);
  console.error(`Paystack type: ${error.type}`);
  console.error(`Paystack Request ID: ${error.requestId}`);
  console.error(error.raw);
}
```

Utiliza `error.code` y `error.type` para gestionar bifurcaciones en caso de fallos de validación, de procesamiento o de la API. `requestId` resulta útil para correlacionar registros (logs) o escalar un problema al equipo de soporte de Paystack, mientras que `error.raw` / `error.body` permiten conservar el envoltorio de respuesta original para fines de diagnóstico.

## Errores

- Paystack emplea códigos de estado HTTP convencionales, tales como `200`, `201`, `400`, `401`, `404` y `5xx`.
- Las respuestas de error suelen incluir `status`, `message`, `type`, `code`, además de información de diagnóstico opcional (`meta`).
- Los tipos de error descritos en `Paystack-API/0d-Errors.md` incluyen `api_error`, `validation_error` y `processor_error`.
- Para los flujos de cobro (_charge_) y verificación (_verify_), inspecciona siempre el cuerpo de la respuesta (_response body_) y los campos de estado, no solo el código HTTP.

## Cobertura

Este SDK se genera a partir de la especificación del SDK contenida en este _monorepo_ y, actualmente, incluye el conjunto completo de operaciones tipadas generadas conforme al contrato de la API de Paystack.

## Módulos

En este SDK, estas familias de esquemas se exponen mediante tipos de TypeScript generados en `src/openapi-types.ts` y funciones auxiliares de operación en `src/operations.ts`.

| Módulo                                                                                    | Familia de esquemas / modelos                            |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Transacciones                                                                             | `Transaction*`                                           |
| Verificación de pagos (verificación de transacciones)                                     | `VerifyResponse / TransactionFetchResponse`              |
| Cobros (_Charges_)                                                                        | `Charge*`                                                |
| Cobros masivos (_Bulk Charges_)                                                           | `BulkCharge*`                                            |
| Subcuentas                                                                                | `Subaccount*`                                            |
| División de transacciones (_Transaction Splits_)                                          | `Split*`                                                 |
| Terminal                                                                                  | `Terminal*`                                              |
| Terminal virtual                                                                          | `VirtualTerminal*`                                       |
| Clientes                                                                                  | `Customer*`                                              |
| Domiciliación bancaria                                                                    | `DirectDebit*`                                           |
| Cuentas virtuales dedicadas                                                               | `DedicatedNuban* / DedicatedVirtualAccount*`             |
| Apple Pay                                                                                 | `ApplePay*`                                              |
| Planes                                                                                    | `Plan*`                                                  |
| Suscripciones                                                                             | `Subscription*`                                          |
| Destinatarios de transferencias                                                           | `TransferRecipient*`                                     |
| Transferencias                                                                            | `Transfer*`                                              |
| Control de transferencias (configuración de OTP; en Transferencias)                       | `TransferEnable* / TransferDisable* / TransferFinalize*` |
| Saldo                                                                                     | `Balance*`                                               |
| Solicitudes de pago (facturas)                                                            | `PaymentRequest*`                                        |
| Verificación (resolución de cuenta / validación de cuenta / resolución de BIN de tarjeta) | `Verification*`                                          |
| Productos                                                                                 | `Product*`                                               |
| Tiendas (Storefronts)                                                                     | `Storefront*`                                            |
| Pedidos                                                                                   | `Order*`                                                 |
| Páginas de pago                                                                           | `Page*`                                                  |
| Liquidaciones                                                                             | `Settlement*`                                            |
| Integración                                                                               | `Integration*`                                           |
| Panel de control (tiempo de espera de la sesión de pago; en Integración)                  | `ControlPanel*`                                          |
| Reembolsos                                                                                | `Refund*`                                                |
| Disputas                                                                                  | `Dispute*`                                               |
| Bancos                                                                                    | `Bank*`                                                  |
| Varios                                                                                    | `Miscellaneous* / Currency`                              |

## Ejemplos de módulos

Estos ejemplos son deliberadamente breves. Úsalos como puntos de partida y, a continuación, amplía los cuerpos de las solicitudes con los campos tipados que muestra tu editor y `src/openapi-types.ts`.

### Transacciones

```ts
const tx = await paystack.transaction_initialize({
  body: { email: "customer@example.com", amount: 5000 },
});
```

### Verificación de pagos (verificación de transacciones)

```ts
const verified = await paystack.transaction_verify({
  params: { path: { reference: "ref_123" } },
});
```

### Cargos

```ts
await paystack.charge_create({
  body: {
    email: "customer@example.com",
    amount: 5000,
    bank: { code: "057", account_number: "0001234567" },
  },
});
```

### Cargos masivos

```ts
await paystack.bulkCharge_initiate({
  body: [{ authorization: "AUTH_xxx", amount: 5000, reference: "bulk-ref-1" }],
});
```

### Subcuentas

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

### División de transacciones

```ts
await paystack.split_create({
  body: { name: "Main split", type: "percentage", currency: "NGN", subaccounts: [] },
});
```

### Terminal

```ts
const terminals = await paystack.terminal_list();
```

### Terminal virtual

```ts
await paystack.virtualTerminal_create({
  body: { name: "Web checkout terminal" },
});
```

### Clientes

```ts
await paystack.customer_create({
  body: { email: "customer@example.com", first_name: "Ada", last_name: "Lovelace" },
});
```

### Débito directo

```ts
await paystack.directdebit_initialize({
  body: { email: "customer@example.com", amount: 5000, bank_code: "057" },
});
```

### Cuentas virtuales dedicadas

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

### Planes

```ts
await paystack.plan_create({
  body: { name: "Starter", amount: 500000, interval: "monthly" },
});
```

### Suscripciones

```ts
await paystack.subscription_create({
  body: { customer: "CUS_xxx", plan: "PLN_xxx" },
});
```

### Destinatarios de transferencias

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

### Transferencias

```ts
await paystack.transfer_create({
  body: { source: "balance", amount: 5000, recipient: "RCP_xxx", reason: "Vendor payout" },
});
```

### Control de transferencias (configuración de OTP; en la sección de Transferencias)

```ts
await paystack.transfer_enableOtp();
```

### Saldo

```ts
const balance = await paystack.balance_fetch();
```

### Solicitudes de pago (facturas)

```ts
await paystack.paymentRequest_create({
  body: { customer: "CUS_xxx", amount: 5000, description: "Consulting invoice" },
});
```

### Verificación (resolución de cuenta / validación de cuenta / resolución de BIN de tarjeta)

```ts
await paystack.bank_resolveAccountNumber({
  params: { query: { account_number: "0001234567", bank_code: "057" } },
});
```

### Productos

```ts
await paystack.product_create({
  body: { name: "T-shirt", description: "Cotton tee", price: 5000, currency: "NGN" },
});
```

### Tiendas

```ts
const storefronts = await paystack.storefront_list();
```

### Pedidos

```ts
await paystack.order_create({
  body: { customer: "CUS_xxx", items: [] },
});
```

### Páginas de pago

```ts
await paystack.page_create({
  body: { name: "Event Ticket", amount: 5000, description: "Landing page for ticket sales" },
});
```

### Liquidaciones

```ts
const settlements = await paystack.settlement_list();
```

### Integración

```ts
const timeout = await paystack.integration_fetchPaymentSessionTimeout();
```

### Panel de control (tiempo de espera de la sesión de pago; en la sección de Integración)

```ts
await paystack.integration_updatePaymentSessionTimeout({
  body: { timeout: 20 },
});
```

### Reembolsos

```ts
await paystack.refund_create({
  body: { transaction: 123456789, amount: 5000 },
});
```

### Disputas

```ts
const disputes = await paystack.dispute_list();
```

### Bancos

```ts
const banks = await paystack.bank_list({ params: { query: { country: "nigeria" } } });
```

### Varios

```ts
const countries = await paystack.miscellaneous_listCountries();
```

## SDK relacionados

- [@alexasomba/paystack-browser](https://github.com/alexasomba/paystack-browser) - Optimizado para peticiones desde el navegador.
- [@alexasomba/paystack-axios](https://github.com/alexasomba/paystack-axios) - Para proyectos que utilizan Axios.

## Utilizado por

- **[Better Auth Paystack Plugin](https://github.com/alexasomba/better-auth-paystack)**: Un plugin integral de Paystack para Better Auth.

## Fuente

- Fuente del monorepo: [alexasomba/paystack-openapi](https://github.com/alexasomba/paystack-openapi)
- Repositorio del SDK independiente: [https://github.com/alexasomba/paystack-node](https://github.com/alexasomba/paystack-node)

## Licencia

MIT
