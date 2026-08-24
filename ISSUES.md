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

---

### Issue 6: Implement `loom account fund` Command
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
To make testnet development easier, developers should be able to fund an account instantly via Friendbot directly from the CLI.

**Acceptance Criteria:**
- Create a new command in `src/commands/fund.ts`.
- The command should accept a public key: `loom account fund <publicKey>`.
- Make an HTTP request to the Stellar Friendbot URL for testnet/futurenet.
- Handle success and error responses gracefully.
- Register the command in `src/index.ts`.

---

### Issue 7: Add configuration file support (`~/.loomrc`)
**Labels:** `enhancement`, `Medium`

**Description:**
Typing `--network testnet` for every command is tedious. The CLI should support a configuration file to store default network settings and saved keys.

**Acceptance Criteria:**
- Integrate a configuration library (like `conf` or `rc`).
- Add a `loom config set <key> <value>` command.
- Ensure commands like `loom balance` and `loom tx submit` read the default network from the config if the flag is omitted.

---

### Issue 8: Implement `loom tx sign` Command
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
Developers often have an unsigned XDR envelope that they need to sign with a secret key before submission. 

**Acceptance Criteria:**
- Create `src/commands/sign.ts`.
- Command format: `loom tx sign <xdr> --secret <secretKey>`.
- Use `TransactionEnvelope.fromXDR`, sign it with the provided key using `@stellar/stellar-sdk`'s `Keypair`, and output the new signed XDR string.

---

## `astral-loom-widgets` Issues

### Issue 9: Create `<TransactionHistory />` Component
**Labels:** `enhancement`, `High`, `help wanted`

**Description:**
A fundamental widget for dApps is showing a user's recent transactions. We need a paginated table component that fetches and displays this history.

**Acceptance Criteria:**
- Create `src/components/TransactionHistory.tsx`.
- Accept a `publicKey` prop and a `network` prop.
- Fetch the last 10 transactions from Horizon using `@stellar/stellar-sdk`.
- Display a clean table (Date, Type, Amount, Status).
- Add a Storybook story `src/stories/TransactionHistory.stories.ts`.

---

### Issue 10: Create `<AssetBadge />` Component
**Labels:** `enhancement`, `Trivial`, `good first issue`

**Description:**
A small UI component used to display a Stellar Asset (e.g. USDC, native XLM) with its code, issuer (truncated), and an optional icon.

**Acceptance Criteria:**
- Create `src/components/AssetBadge.tsx`.
- Accept props: `assetCode`, `issuer`, `iconUrl`.
- Render a styled pill/badge.
- Add a Storybook story `src/stories/AssetBadge.stories.ts`.

---

### Issue 11: Create `<QRPaymentRequest />` Component
**Labels:** `enhancement`, `Medium`, `help wanted`

**Description:**
We want a widget that generates a QR code representing a payment request (e.g. standard SEP-7 URI or a custom JSON payload) so users can scan it with their mobile wallets.

**Acceptance Criteria:**
- Create `src/components/QRPaymentRequest.tsx`.
- Accept props: `destination`, `amount`, `assetCode`, `memo`.
- Use a QR code generation library (e.g., `qrcode.react`) to render the request.
- Add a Storybook story `src/stories/QRPaymentRequest.stories.ts`.

---

### Issue 12: Create `useWallet` React Hook
**Labels:** `enhancement`, `High`

**Description:**
To manage wallet state easily in React applications, we need a standard hook that wraps our `astral-loom-kit` wallet adapters.

**Acceptance Criteria:**
- Create `src/hooks/useWallet.ts`.
- Manage state for `isConnected`, `publicKey`, and `adapter`.
- Expose methods `connect()`, `disconnect()`, and `signTransaction()`.
- Ensure it works seamlessly with the `FreighterAdapter` from the kit.

---

### Issue 13: Implement Dark Mode CSS variables
**Labels:** `enhancement`, `Medium`, `good first issue`

**Description:**
All widgets need to support standard light/dark modes automatically based on user system preferences or overriding classes.

**Acceptance Criteria:**
- Define CSS variables for colors (e.g., `--loom-bg`, `--loom-text`, `--loom-primary`) in a base CSS file.
- Add a `@media (prefers-color-scheme: dark)` block.
- Update `<BalanceCard />` to use these CSS variables.
- Add a dark mode toggle to the Storybook preview.

---

## `astral-loom-kit` Issues (Continued)

### Issue 14: Implement Path Payment Helper
**Labels:** `enhancement`, `High`, `help wanted`

**Description:**
Sending path payments is complex because it requires fetching orderbook paths. We need a helper function `buildPathPayment`.

**Acceptance Criteria:**
- Create `buildPathPayment` in `src/transactions/helpers.ts`.
- Accept source, destination, send asset, dest asset, and dest amount.
- Fetch the best path from Horizon, then construct the `Operation.pathPaymentStrictReceive`.
- Throw clear errors if no path exists.

### Issue 15: Add Futurenet Config Preset
**Labels:** `enhancement`, `Trivial`, `good first issue`

**Description:**
We currently support testnet and mainnet configurations, but Futurenet is increasingly important for Soroban development.

**Acceptance Criteria:**
- Update `src/network/config.ts`.
- Add `FUTURENET_PASSPHRASE` and default Horizon RPC URLs for Futurenet.
- Export a `FuturenetConfig` object.
