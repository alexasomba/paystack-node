# Changelog

## [1.11.0](https://github.com/alexasomba/paystack-node/compare/v1.10.7...v1.11.0) (2026-06-01)


### Features

* add GitHub Actions workflow to automate release creation on tag push ([a8f3fda](https://github.com/alexasomba/paystack-node/commit/a8f3fda39d56d3a5907f09094fae2f6bf62c7e28))
* bump OpenAPI version and add GitHub Actions workflow for automated package publishing ([5617004](https://github.com/alexasomba/paystack-node/commit/56170046a83d583fb02345d7e5f2693a35a83ad4))
* bump package version to 1.2.0 and update `@types/node` dev dependency. ([7bb0972](https://github.com/alexasomba/paystack-node/commit/7bb0972b72051a1950db2cc74ab374adae40c8d2))
* infrastructure - explicitly configure scope and auth for publish ([2c47cd2](https://github.com/alexasomba/paystack-node/commit/2c47cd2f47e3dcb43929665b87f6e740860c588c))
* infrastructure - finalize npm publish workflow on Node 24 ([77f7f2f](https://github.com/alexasomba/paystack-node/commit/77f7f2f2b854256530e9cd33dc56aa125714adb7))
* infrastructure - finalized CI/CD with Automation Token support ([3ff0005](https://github.com/alexasomba/paystack-node/commit/3ff00055444860b83376fa1fdd64d8d375363fa3))
* infrastructure - production-ready NPM automation with verified Automation Token ([1919b33](https://github.com/alexasomba/paystack-node/commit/1919b338abfba304ba590ee751f5d7c783100db4))
* infrastructure - switch to pnpm and Node 24 support ([846e158](https://github.com/alexasomba/paystack-node/commit/846e158a4b23ee265750bef1b29b66acaa19181f))
* regenerate SDK types, add comprehensive test suite, and configure build infrastructure ([c620c22](https://github.com/alexasomba/paystack-node/commit/c620c22563161ef3e081977c0d50a22d3a8190f3))
* sync SDKs from openapi spec (v1.9.4) ([9507361](https://github.com/alexasomba/paystack-node/commit/95073616f7d7bc3b08f977654b85500aeb950ed4))


### Bug Fixes

* add scope to setup-node and finalize publish strategy ([a754c70](https://github.com/alexasomba/paystack-node/commit/a754c704536d18cee4ea940ae5ccf3b9bb0e21c2))
* clean up workflow and finalize pnpm switch ([e064bc8](https://github.com/alexasomba/paystack-node/commit/e064bc8119ccd491855c7d6fc4fa1394ecffe7ea))
* finalize workflow and sync scripts with master branch ([eaa4050](https://github.com/alexasomba/paystack-node/commit/eaa4050980cc300af784cabf4e2da7c9b2633bf3))
* finalize workflow with npm publish and clean pnpm setup ([86c2dc9](https://github.com/alexasomba/paystack-node/commit/86c2dc9d9daa1a6cbbce4595964f3d32d9cd93db))
* finalized workflow and publish infrastructure ([ab6bbfb](https://github.com/alexasomba/paystack-node/commit/ab6bbfb906b11779afc5cdc97aff9664b0843997))
* finalized workflow and publish infrastructure ([e0bf031](https://github.com/alexasomba/paystack-node/commit/e0bf031a580d422ad63b8a90d9ed6fbbd27e75ba))
* switch to pnpm and update workflow for master branch ([f78148d](https://github.com/alexasomba/paystack-node/commit/f78148def179bac92fefc802f2b16e8033556468))
* switch to pnpm and update workflow for Node 24 ([98f1213](https://github.com/alexasomba/paystack-node/commit/98f12131d6ec1ac05d2b3dc02e0f112b9f0957c4))
* synchronize workflow and pnpm across master ([821592c](https://github.com/alexasomba/paystack-node/commit/821592cd2e21bf27495dc72fe7d53f11e842b01e))
* update workflow and switch to pnpm ([823833e](https://github.com/alexasomba/paystack-node/commit/823833eb5208be2222d5faf97c0d72aecdf3eb15))
* update workflow and switch to pnpm ([0af2adb](https://github.com/alexasomba/paystack-node/commit/0af2adb981a5c51196db9d437970b6a64af89715))

## [1.10.7](https://github.com/alexasomba/paystack-node/compare/v1.10.6...v1.10.7) (2026-06-01)

### Bug Fixes

- publish provenance-enabled npm release

## [1.10.6](https://github.com/alexasomba/paystack-node/compare/v1.10.5...v1.10.6) (2026-06-01)

### Bug Fixes

- preserve Paystack error envelope fields on `PaystackError`
- keep raw error bodies and transport causes available for diagnostics
- align generated SDK release-readiness metadata checks

## [1.9.0](https://github.com/alexasomba/paystack-node/compare/v1.8.0...v1.9.0) (2026-04-16)

### Features

- infrastructure - production-ready NPM automation with verified Automation Token ([1919b33](https://github.com/alexasomba/paystack-node/commit/1919b338abfba304ba590ee751f5d7c783100db4))

## [1.8.0](https://github.com/alexasomba/paystack-node/compare/v1.7.0...v1.8.0) (2026-04-16)

### Features

- infrastructure - finalized CI/CD with Automation Token support ([3ff0005](https://github.com/alexasomba/paystack-node/commit/3ff00055444860b83376fa1fdd64d8d375363fa3))

### Bug Fixes

- finalized workflow and publish infrastructure ([e0bf031](https://github.com/alexasomba/paystack-node/commit/e0bf031a580d422ad63b8a90d9ed6fbbd27e75ba))

## [1.7.0](https://github.com/alexasomba/paystack-node/compare/v1.6.0...v1.7.0) (2026-04-16)

### Features

- infrastructure - explicitly configure scope and auth for publish ([2c47cd2](https://github.com/alexasomba/paystack-node/commit/2c47cd2f47e3dcb43929665b87f6e740860c588c))

### Bug Fixes

- add scope to setup-node and finalize publish strategy ([a754c70](https://github.com/alexasomba/paystack-node/commit/a754c704536d18cee4ea940ae5ccf3b9bb0e21c2))

## [1.6.0](https://github.com/alexasomba/paystack-node/compare/v1.5.0...v1.6.0) (2026-04-16)

### Features

- infrastructure - finalize npm publish workflow on Node 24 ([77f7f2f](https://github.com/alexasomba/paystack-node/commit/77f7f2f2b854256530e9cd33dc56aa125714adb7))

### Bug Fixes

- finalize workflow with npm publish and clean pnpm setup ([86c2dc9](https://github.com/alexasomba/paystack-node/commit/86c2dc9d9daa1a6cbbce4595964f3d32d9cd93db))

## [1.5.0](https://github.com/alexasomba/paystack-node/compare/v1.4.0...v1.5.0) (2026-04-16)

### Features

- infrastructure - switch to pnpm and Node 24 support ([846e158](https://github.com/alexasomba/paystack-node/commit/846e158a4b23ee265750bef1b29b66acaa19181f))

### Bug Fixes

- clean up workflow and finalize pnpm switch ([e064bc8](https://github.com/alexasomba/paystack-node/commit/e064bc8119ccd491855c7d6fc4fa1394ecffe7ea))
- update workflow and switch to pnpm ([823833e](https://github.com/alexasomba/paystack-node/commit/823833eb5208be2222d5faf97c0d72aecdf3eb15))

## [1.4.0](https://github.com/alexasomba/paystack-node/compare/v1.3.0...v1.4.0) (2026-04-16)

### Features

- add GitHub Actions workflow to automate release creation on tag push ([a8f3fda](https://github.com/alexasomba/paystack-node/commit/a8f3fda39d56d3a5907f09094fae2f6bf62c7e28))
- bump OpenAPI version and add GitHub Actions workflow for automated package publishing ([5617004](https://github.com/alexasomba/paystack-node/commit/56170046a83d583fb02345d7e5f2693a35a83ad4))
