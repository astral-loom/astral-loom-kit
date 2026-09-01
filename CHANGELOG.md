# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Extracted `AlbedoAdapter` out of `adapters.ts` into its own dedicated file (`src/wallets/albedo.ts`) with full unit test coverage

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
