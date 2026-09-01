# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Albedo wallet adapter (`AlbedoAdapter`)

## [0.1.0] - 2026-08-31

### Added
- Initial release
- Freighter wallet adapter (`WalletAdapter` interface + `FreighterAdapter` implementation)
- Transaction helpers for common operations (`buildPayment` and `buildTrustline`)
- Network configuration presets for testnet, mainnet, and futurenet
- Human-readable error mapping utilities for cryptic Horizon/SDK errors
