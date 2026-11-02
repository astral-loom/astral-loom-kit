# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Integration tests for wallet adapter connect/sign flows (`albedo.integration.test.ts`, `adapters.integration.test.ts`): connect, sign, user rejection, missing extension/library, and network passphrase mismatch paths — all mocked, no browser extension required (#28)

### Fixed
- Corrected the Futurenet network passphrase from `Test SDF Future Network ; Fall 2022` to the official `Test SDF Future Network ; October 2022`. Signatures produced for Futurenet were invalid on-chain.

### Changed
- Extracted `AlbedoAdapter` out of `adapters.ts` into its own dedicated file (`src/wallets/albedo.ts`) with full unit test coverage
- Documented the xBull adapter gap in `README.md` and `ISSUES.md`: no `src/wallets/xbull.ts` exists on `main`, and the correct SDK package is `@creit.tech/xbull-wallet-connect` (`@creit-tech/xbull-app-sdk` 404s on npm)

### Removed
- `XBullAdapter` — removed from `main` pending a proper reimplementation with dedicated file structure and unit tests (was present but untested in v0.1.0). This will be a breaking change for anyone relying on `XBullAdapter` from v0.1.0 once the next version is published.

## [0.1.0] - 2026-08-31

### Added
- Initial release
- Wallet adapters: `FreighterAdapter`, `AlbedoAdapter`, `XBullAdapter` (implementing a common `WalletAdapter` interface)
- Transaction helpers: `buildPayment`, `buildTrustline`, `buildBatchPayment`, `buildPathPayment`
- Network configuration presets for testnet, mainnet, and futurenet
- Human-readable error mapping utilities for cryptic Horizon/SDK errors

### Note
- In this initial release, AlbedoAdapter and XBullAdapter were implemented but lacked dedicated files and unit tests. These are being addressed in subsequent updates (see Unreleased section).
