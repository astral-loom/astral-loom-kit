# Astral Loom — Issue Drafts

Here are some drafted issues for the Phase 2 backlog, formatted for GitHub.

---

## `astral-loom-kit` Issues

### Issue 1: Add Albedo Wallet Adapter
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
Currently, `astral-loom-kit` supports the Freighter wallet via the `FreighterAdapter`. We want to add support for the Albedo wallet to expand our ecosystem.

**Acceptance Criteria:**
- Create `src/wallets/albedo.ts` implementing the `WalletAdapter` interface.
- Implement `connect()`, `getPublicKey()`, `signTransaction()`, and `isConnected()` using `@albedo-link/intent`.
- Export the `AlbedoAdapter` in `src/wallets/index.ts`.
- Ensure tests run successfully and the code passes linting.

**Pointers:**
- Reference implementation: `src/wallets/adapters.ts` (FreighterAdapter).
- Albedo docs: https://albedo.link/docs

---

### Issue 2: Add xBull Wallet Adapter
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
Add a wallet adapter for xBull so dApps can seamlessly integrate it using our standard `WalletAdapter` interface.

**Acceptance Criteria:**
- Create `src/wallets/xbull.ts` implementing the `WalletAdapter` interface.
- Implement `connect()`, `getPublicKey()`, `signTransaction()`, and `isConnected()` using `@creit-tech/xbull-app-sdk`.
- Export the `XBullAdapter` in `src/wallets/index.ts`.
- Ensure tests run successfully and the code passes linting.

**Pointers:**
- Reference implementation: `src/wallets/adapters.ts` (FreighterAdapter).

---

### Issue 3: Implement Batch Payment Helper
**Labels:** `enhancement`, `High`, `help wanted`

**Description:**
We have `buildPayment`, but developers often need to send payments to multiple destinations in a single transaction.

**Acceptance Criteria:**
- Create `buildBatchPayment` in `src/transactions/helpers.ts`.
- Accept an array of destinations and amounts, along with source, asset, and network config.
- Return an unsigned Stellar `Transaction` containing an `Operation.payment` for each destination.
- Throw appropriate errors from our `errors` module if validation fails.
- Add unit tests.

---

## `astral-loom-cli` Issues

### Issue 4: Implement `loom balance` Command
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
Developers frequently need to check account balances and trustlines on the command line. We need a `loom balance` command that queries the network and displays this data in a readable table.

**Acceptance Criteria:**
- Create a new command in `src/commands/balance.ts`.
- The command should accept a public key: `loom balance <publicKey> --network <testnet|mainnet>`.
- Query the Horizon API using `@stellar/stellar-sdk` for the account details.
- Print a formatted table (e.g., using `cli-table3`) showing asset code, balance, and limit.
- Register the command in `src/index.ts`.

---

### Issue 5: Implement `loom tx submit` Command
**Labels:** `enhancement`, `Trivial`, `good first issue`

**Description:**
After decoding or signing XDR, we need an easy way to submit the raw transaction envelope to the network.

**Acceptance Criteria:**
- Create a new command in `src/commands/submit.ts`.
- The command should accept a base64 XDR string: `loom tx submit <xdrString> --network <testnet|mainnet>`.
- Reconstruct the transaction using `TransactionEnvelope.fromXDR`.
- Submit it to Horizon using `server.submitTransaction`.
- Log the success hash or error clearly to the console.
- Register the command in `src/index.ts`.
