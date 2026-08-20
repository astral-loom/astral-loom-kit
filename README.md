# Astral Loom Kit

A unified integration toolkit for Stellar dApp developers. This package wraps the core `@stellar/stellar-sdk` into simpler, higher-level utilities so developers don't have to re-implement common boilerplate.

## Installation

Install using npm:

```bash
npm install astral-loom-kit @stellar/stellar-sdk
```

Or using yarn:

```bash
yarn add astral-loom-kit @stellar/stellar-sdk
```

## Features and Quick Start

### 1. Network Utilities

Easily switch between Stellar networks.

```typescript
import { getNetwork, switchNetwork } from 'astral-loom-kit';

// Get network configuration
const config = getNetwork('testnet');
console.log(config.url); // https://horizon-testnet.stellar.org

// Get a configured Horizon Server instance
const server = switchNetwork('testnet');
```

### 2. Connect a Wallet (Freighter)

Connect to the Freighter wallet extension and sign transactions.

```typescript
import { FreighterAdapter } from 'astral-loom-kit';

const adapter = new FreighterAdapter();

async function connectWallet() {
  const publicKey = await adapter.connect();
  console.log('Connected:', publicKey);
}
```

### 3. Build a Payment Transaction

Construct a payment transaction without signing or submitting it yet.

```typescript
import { buildPayment } from 'astral-loom-kit';

const transaction = buildPayment({
  source: 'GA...YOUR_ACCOUNT_ID',
  sourceSequence: '1234567890',
  destination: 'GB...DESTINATION_ID',
  assetCode: 'XLM',
  amount: '10.5',
  network: 'testnet',
});
```

### 4. Build a Trustline Transaction

Construct a change trust operation to accept a specific asset.

```typescript
import { buildTrustline } from 'astral-loom-kit';

const transaction = buildTrustline({
  source: 'GA...YOUR_ACCOUNT_ID',
  sourceSequence: '1234567890',
  assetCode: 'USDC',
  assetIssuer: 'GB...ISSUER_ID',
  network: 'testnet',
});
```

### 5. Error Handling

Map raw Horizon or Stellar SDK errors into human-readable messages.

```typescript
import { mapStellarError } from 'astral-loom-kit';

try {
  // some stellar operation
} catch (error) {
  const mapped = mapStellarError(error);
  console.log(mapped.code); // e.g. 'INSUFFICIENT_BALANCE'
  console.error(mapped.message); // Human-readable message
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to set up the project locally and contribute.

## License

MIT License.