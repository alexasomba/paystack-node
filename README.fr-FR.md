[English](README.md) · [Español](README.es-ES.md) · [Français](README.fr-FR.md)

# @alexasomba/paystack-node

[![npm version](https://img.shields.io/npm/v/@alexasomba/paystack-node.svg)](https://www.npmjs.com/package/@alexasomba/paystack-node)
[![license](https://img.shields.io/npm/l/@alexasomba/paystack-node.svg)](https://github.com/alexasomba/paystack-node/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alexasomba/paystack-node)](https://bundlephobia.com/package/@alexasomba/paystack-node)

Client API Paystack de type TypeScript pour Node.js, généré à partir de la spécification officielle Paystack OpenAPI.


## Fonctionnalités

- **Précision basée sur les spécifications** : générée directement à partir de la spécification Paystack OpenAPI.
- **100 % Type-safe** : prise en charge complète de TypeScript avec des types générés pour chaque point de terminaison, requête et réponse.
- **Smart Retries** : tentatives automatiques en cas d'échecs transitoires avec interruption exponentielle et instabilité.
- **Réessayer-après conformité** : respecte automatiquement les en-têtes Paystack `Retry-After` sur les réponses de limite de débit.
- **Idempotence sophistiquée** : prise en charge intégrée des clés d'idempotence manuelles, statiques ou automatiques basées sur l'UUID sur les requêtes POST.
- **Gestion détaillée des erreurs** : `PaystackError` préserve Paystack `code`, `type`, `meta`, l'ID de demande, l'état HTTP et le corps brut de la réponse.
- **Vérification du Webhook** : assistant de vérification de signature de webhook sécurisé dans le temps inclus.


## Installer

```bash
pnpm add @alexasomba/paystack-node
```


## Compétences des agents

Ce package contient des compétences TanStack Intent pour l'intégration de Paystack assistée par agent :

```bash
npx @tanstack/intent@latest list
npx @tanstack/intent@latest install --map
npx @tanstack/intent@latest load @alexasomba/paystack-node#paystack-node-api-operations
```

Les compétences utiles incluent `paystack-node-client-setup`, `paystack-node-api-operations`, `paystack-node-operation-discovery`, `paystack-node-typed-payloads`, `paystack-node-responses-errors`, `paystack-node-retries-idempotency`, `paystack-node-transport-testing` et `paystack-node-webhooks`.

Authentifiez les demandes avec votre clé secrète Paystack :

```ts
process.env.PAYSTACK_SECRET_KEY = "sk_test_...";
```


## Démarrage rapide

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

`assertOk` renvoie la charge utile Paystack réussie et lance un `PaystackError` structuré pour les réponses non 2xx ou les enveloppes `{ status: false }`.


## Bases de l'API

- URL de base : `https://api.paystack.co`
- HTTPS est requis pour toutes les demandes.
- Les demandes et les réponses sont basées sur JSON.
- Les réponses les plus réussies suivent les enveloppes `status`, `message`, `data` et `meta` en option décrites dans `Paystack-API/0a-Introduction.md`.
- Les montants sont généralement envoyés en sous-unités monétaires telles que le kobo, les pesewas ou les centimes. Consultez la documentation du module pour connaître les règles spécifiques aux devises.


## Authentification et environnements

- Les SDK côté serveur doivent utiliser votre clé secrète (`sk_test_*` ou `sk_live_*`).
- Les SDK du navigateur doivent utiliser uniquement votre clé publique (`pk_test_*` ou `pk_live_*`).
- Envoyez les informations d'identification de l'API côté serveur sous la forme `Authorization: Bearer YOUR_SECRET_KEY`.
- Les modes test et live utilisent différentes clés et environnements isolés.
- Faites pivoter les clés si elles sont exposées et ne confiez jamais les clés secrètes au contrôle de code source.
- Si vous activez la liste blanche des adresses IP dans Paystack, les demandes provenant d'adresses IP non sur liste blanche seront bloquées.


## Configuration avancée

L'assistant `createPaystack` accepte `PaystackClientOptions` :

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


## Exportations de type stable

Ce SDK exporte des tranches client groupées stables et des alias de requête/requête/réponse organisés afin que les intégrations en aval n'aient pas besoin de reconstruire les types à partir de `ReturnType<typeof createPaystack>`, `paths` ou `operations`.

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

Les alias notables incluent l'initialisation de la transaction/l'autorisation de facturation/la vérification ; abonnement créer/lister/désactiver/activer/récupérer/gérer le lien/gérer le courrier électronique ; le client récupère / crée / met à jour ; liste de plans / créer / mettre à jour / récupérer ; liste de produits/créer/mettre à jour/récupérer ; liste de contestation/récupération ; remboursement créer/récupérer ; demande de paiement créer/récupérer ; événement d'envoi de terminal ; et des aides à la vérification pour la résolution de compte, la validation de compte et la recherche de BIN de carte.

Les tranches client incluent `PaystackTransactionClient`, `PaystackCustomerClient`, `PaystackSubscriptionClient`, `PaystackPlanClient`, `PaystackProductClient`, `PaystackDisputeClient` et `PaystackRefundClient`.

Les méthodes groupées reflètent les opérations OpenAPI générées prises en charge. Les assistants non pris en charge tels que `subscription.update` ne font intentionnellement pas partie de la surface publique du SDK.


### Webhooks

Utilisez l'assistant webhook lors de la validation des événements de serveur à serveur à partir de Paystack. Transmettez le corps brut de la requête, pas un objet JSON analysé.

```ts
import { verifyPaystackWebhookSignature } from "@alexasomba/paystack-node/webhooks";

const isValid = verifyPaystackWebhookSignature({
  rawBody: req.body,
  signature: req.headers["x-paystack-signature"],
  secret: process.env.PAYSTACK_SECRET_KEY!,
});
```


### Gestion de la pagination

Les points de terminaison de liste exposent les contrôles de pagination via des paramètres de requête tels que `perPage`, `page`, `next` et `previous`. Les en-têtes de réponse sont toujours disponibles lorsque vous avez besoin d’un contrôle manuel de la pagination.


## Pagination

- Paystack prend en charge à la fois la pagination décalée et la pagination du curseur.
- La pagination décalée utilise `page` et `perPage`.
- La pagination du curseur utilise les curseurs `use_cursor=true` plus `next` ou `previous` renvoyés dans `meta`.
- La pagination du curseur est particulièrement utile pour les ensembles de données volumineux ou qui changent fréquemment.
- La forme exacte du `meta` varie selon le point final et le mode de pagination.

```ts
const result = await paystack.customer_list({ query: { perPage: 20 } });
const customers = assertOk(result);
const total = result.response.headers.get("x-total-count");
```


## Gestion des erreurs

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

Utilisez `error.code` et `error.type` pour effectuer un branchement sur les échecs de validation, de processeur et d'API. Le `requestId` est utile pour corréler les journaux ou faire remonter un problème avec la prise en charge de Paystack, tandis que `error.raw` / `error.body` conserve l'enveloppe de réponse d'origine disponible pour les diagnostics.


## Erreurs

- Paystack utilise des codes d'état HTTP conventionnels tels que `200`, `201`, `400`, `401`, `404` et `5xx`.
- Les réponses d'erreur incluent généralement `status`, `message`, `type`, `code` et des informations de diagnostic facultatives `meta`.
- Les types d'erreurs décrits dans `Paystack-API/0d-Errors.md` incluent `api_error`, `validation_error` et `processor_error`.
- Pour les flux de facturation et de vérification, inspectez toujours le corps de la réponse et les champs d'état renvoyés, pas seulement le code HTTP.


## Couverture

Ce SDK est généré à partir de la spécification SDK dans ce monorepo et suit actuellement l'ensemble complet des opérations typées générées pour le contrat aligné sur l'API Paystack.

## Modules

Pour ce SDK, ces familles de schémas sont exposées via des types TypeScript générés dans `src/openapi-types.ts` et des aides aux opérations dans `src/operations.ts`.

| Module | Schéma / famille de modèles |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Opérations | `Transaction*` |
| Vérifier les paiements (vérification des transactions) | `VerifyResponse / TransactionFetchResponse` |
| Frais | `Charge*` |
| Frais de gros | `BulkCharge*` |
| Sous-comptes | `Subaccount*` |
| Fractionnements de transactions | `Split*` |
| Borne | `Terminal*` |
| Terminal virtuel | `VirtualTerminal*` |
| Clients | `Customer*` |
| Prélèvement automatique | `DirectDebit*` |
| Comptes virtuels dédiés | `DedicatedNuban* / DedicatedVirtualAccount*` |
| Apple Payer | `ApplePay*` |
| Forfaits | `Plan*` |
| Abonnements | `Subscription*` |
| Destinataires du transfert | `TransferRecipient*` |
| Transferts | `Transfer*` |
| Contrôle des transferts (paramètres OTP ; sous Transferts) | `TransferEnable* / TransferDisable* / TransferFinalize*` |
| Solde | `Balance*` |
| Demandes de paiement (factures) | `PaymentRequest*` |
| Vérification (Résoudre le compte / Valider le compte / Résoudre le BIN de la carte) | `Verification*` |
| Produits | `Product*` |
| Vitrines de magasins | `Storefront*` |
| Commandes | `Order*` |
| Pages de paiement | `Page*` |
| Règlements | `Settlement*` |
| Intégration | `Integration*` |
| Panneau de configuration (Délai d'expiration de la session de paiement ; sous Intégration) | `ControlPanel*` |
| Remboursements | `Refund*` |
| Litiges | `Dispute*` |
| Banques | `Bank*` |
| Divers | `Miscellaneous* / Currency` |


## Exemples de modules

Ce sont des exemples volontairement courts. Utilisez-les comme points d'entrée, puis développez les corps de la demande avec les champs saisis exposés par votre éditeur et `src/openapi-types.ts`.


### Transactions

```ts
const tx = await paystack.transaction_initialize({
  body: { email: "customer@example.com", amount: 5000 },
});
```


### Vérifier les paiements (vérification des transactions)

```ts
const verified = await paystack.transaction_verify({
  params: { path: { reference: "ref_123" } },
});
```


### Frais

```ts
await paystack.charge_create({
  body: {
    email: "customer@example.com",
    amount: 5000,
    bank: { code: "057", account_number: "0001234567" },
  },
});
```


### Frais groupés

```ts
await paystack.bulkCharge_initiate({
  body: [{ authorization: "AUTH_xxx", amount: 5000, reference: "bulk-ref-1" }],
});
```


### Sous-comptes

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


### Répartition des transactions

```ts
await paystack.split_create({
  body: { name: "Main split", type: "percentage", currency: "NGN", subaccounts: [] },
});
```


### Terminal
```ts
const terminals = await paystack.terminal_list();
```


### Terminal virtuel

```ts
await paystack.virtualTerminal_create({
  body: { name: "Web checkout terminal" },
});
```


### Clients

```ts
await paystack.customer_create({
  body: { email: "customer@example.com", first_name: "Ada", last_name: "Lovelace" },
});
```


### Prélèvement automatique

```ts
await paystack.directdebit_initialize({
  body: { email: "customer@example.com", amount: 5000, bank_code: "057" },
});
```


### Comptes virtuels dédiés

```ts
await paystack.dedicatedAccount_assign({
  body: { customer: 12345, preferred_bank: "wema-bank" },
});
```


### Apple Pay

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


### Abonnements

```ts
await paystack.subscription_create({
  body: { customer: "CUS_xxx", plan: "PLN_xxx" },
});
```


### Destinataires du transfert

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


### Transferts

```ts
await paystack.transfer_create({
  body: { source: "balance", amount: 5000, recipient: "RCP_xxx", reason: "Vendor payout" },
});
```


### Contrôle des transferts (paramètres OTP ; sous Transferts)

```ts
await paystack.transfer_enableOtp();
```


### Solde

```ts
const balance = await paystack.balance_fetch();
```


### Demandes de paiement (factures)

```ts
await paystack.paymentRequest_create({
  body: { customer: "CUS_xxx", amount: 5000, description: "Consulting invoice" },
});
```


### Vérification (Résoudre le compte / Valider le compte / Résoudre le BIN de la carte)

```ts
await paystack.bank_resolveAccountNumber({
  params: { query: { account_number: "0001234567", bank_code: "057" } },
});
```


### Produits

```ts
await paystack.product_create({
  body: { name: "T-shirt", description: "Cotton tee", price: 5000, currency: "NGN" },
});
```


### Vitrines de magasins

```ts
const storefronts = await paystack.storefront_list();
```


### Commandes

```ts
await paystack.order_create({
  body: { customer: "CUS_xxx", items: [] },
});
```


### Pages de paiement

```ts
await paystack.page_create({
  body: { name: "Event Ticket", amount: 5000, description: "Landing page for ticket sales" },
});
```


### Règlements

```ts
const settlements = await paystack.settlement_list();
```


### Intégration

```ts
const timeout = await paystack.integration_fetchPaymentSessionTimeout();
```


### Panneau de configuration (Délai d'expiration de la session de paiement ; sous Intégration)

```ts
await paystack.integration_updatePaymentSessionTimeout({
  body: { timeout: 20 },
});
```


### Remboursements

```ts
await paystack.refund_create({
  body: { transaction: 123456789, amount: 5000 },
});
```


### Litiges

```ts
const disputes = await paystack.dispute_list();
```


### Banques

```ts
const banks = await paystack.bank_list({ params: { query: { country: "nigeria" } } });
```


### Divers

```ts
const countries = await paystack.miscellaneous_listCountries();
```


## SDK associés

- [@alexasomba/paystack-browser](https://github.com/alexasomba/paystack-browser) - Optimisé pour les récupérations du navigateur.
- [@alexasomba/paystack-axios](https://github.com/alexasomba/paystack-axios) - Pour les projets utilisant Axios.


## Utilisé par

- **[Better Auth Paystack Plugin](https://github.com/alexasomba/better-auth-paystack)** : Un plugin Paystack complet pour une meilleure authentification.


## Source

- Source Monorepo : [alexasomba/paystack-openapi](https://github.com/alexasomba/paystack-openapi)
- Dépôt SDK autonome : [https://github.com/alexasomba/paystack-node](https://github.com/alexasomba/paystack-node)


## Licence

MIT
