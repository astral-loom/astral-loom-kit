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

### 2. Connect a Wallet (Freighter, Albedo, or xBull)

Connect to a supported wallet extension and sign transactions.

```typescript
import { FreighterAdapter, AlbedoAdapter, XBullAdapter } from 'astral-loom-kit';

// You can use any of the supported adapters
const adapter = new FreighterAdapter();
// const adapter = new AlbedoAdapter();
// const adapter = new XBullAdapter();

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

### 4. Build Batch & Path Payments

Easily build more complex payment structures.

```typescript
import { buildBatchPayment, buildPathPayment } from 'astral-loom-kit';

// Batch Payment
const batchTx = buildBatchPayment({
  source: 'GA...YOUR_ACCOUNT_ID',
  sourceSequence: '1234567890',
  assetCode: 'XLM',
  destinations: [
    { destination: 'GB...DEST1', amount: '10' },
    { destination: 'GC...DEST2', amount: '5' }
  ],
  network: 'testnet',
});

// Path Payment
const pathTx = buildPathPayment({
  source: 'GA...YOUR_ACCOUNT_ID',
  sourceSequence: '1234567890',
  sendAssetCode: 'USDC',
  sendAssetIssuer: 'GB...ISSUER_ID',
  sendMax: '10',
  destination: 'GD...DESTINATION_ID',
  destAssetCode: 'XLM',
  destAmount: '50',
  network: 'testnet',
});
```

### 5. Build a Trustline Transaction

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