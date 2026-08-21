# Astral Loom — Product Requirements Document

**Organization:** [astral-loom](https://github.com/astral-loom)
**Status:** Draft / Pre-Wave
**Owner:** Temmy2026
**Last updated:** 2026-08-20

---

## 1. Overview

Astral Loom is a toolkit ecosystem for developers building on the Stellar network. It exists to remove repeated boilerplate — wallet connection, transaction building, error handling, CLI tooling, and UI components — that most Stellar dApp developers currently re-implement from scratch.

The organization is structured as three complementary repositories, each targeting a distinct contributor skill set and use case:

| Repo | Purpose | Primary audience |
|---|---|---|
| `astral-loom-kit` | Core TypeScript SDK: wallets, transactions, errors, network config | dApp / backend developers |
| `astral-loom-cli` | Command-line tool for common Stellar dev tasks | Ops / scripting / power users |
| `astral-loom-widgets` | Embeddable UI components for Stellar data | Frontend / React developers |

Together, these form a coherent "toolkit ecosystem" narrative: SDK → CLI → UI, all built on top of `@stellar/stellar-sdk`.

---

## 2. Problem Statement

Building on Stellar today requires developers to:
- Manually wire up wallet adapters (Freighter, Albedo, xBull) with no shared interface
- Interpret cryptic raw Horizon/SDK errors (`op_underfunded`, `op_no_trust`, `tx_bad_seq`, etc.)
- Re-write basic transaction-building logic (payments, trustlines) per project
- Reach for the Horizon API directly for simple inspection tasks (balances, XDR decoding, account creation) with no unified CLI
- Build UI components (balance displays, transaction history, QR payment requests) from scratch per frontend

Astral Loom solves this by providing a maintained, well-documented, modular toolkit that any Stellar developer can adopt piecemeal or fully.

---

## 3. Goals

1. Ship a working v0.1 of all three repos with real, functional code (not stubs)
2. Build a healthy backlog of well-scoped, contributor-friendly issues across all three repos
3. Get onboarded and approved into a relevant Wave Program (e.g. Stellar Wave Program) for all three repos
4. Sustain repeat Wave cycles by continuously adding new issues as the toolkit grows
5. Build genuine external usage and contributor reputation over time

---

## 4. Non-Goals (for now)

- Building a hosted/paid product or SaaS layer
- Supporting chains other than Stellar
- Building a full-scale block explorer (widgets repo provides components, not a standalone explorer app)
- Deep mobile SDK support (web-first initially)

---

## 5. Repo-Level Scope

### 5.1 `astral-loom-kit`
- Network config presets (testnet/mainnet/futurenet)
- Human-readable error mapping (`mapStellarError`)
- Transaction helpers (`buildPayment`, `buildTrustline`)
- Wallet adapter interface + Freighter implementation
- **Status:** Initial scaffold complete (v0.1)
- **Next:** Albedo adapter, xBull adapter, batch payment helper, path payment helper

### 5.2 `astral-loom-cli`
- `loom account create` — fund/create testnet accounts
- `loom balance` — readable balance/trustline table view
- `loom xdr decode` — pretty-print XDR
- `loom tx submit` — submit signed XDR transactions
- Config file support for saved networks/keys
- **Status:** Not yet started
- **Next:** Scaffold CLI entry point (commander/yargs), implement `account create` and `xdr decode` first (fastest wins)

### 5.3 `astral-loom-widgets`
- `<BalanceCard />` — account balance display
- `<TransactionHistory />` — paginated transaction table
- QR payment-request generator
- Asset/trustline badge component
- Storybook setup for previews
- **Status:** Not yet started
- **Next:** Scaffold React component library + Storybook, build `<BalanceCard />` first

---

## 6. Issue Complexity & Points Model (per Drips Wave)

| Complexity | Points | Use for |
|---|---|---|
| Trivial | 100 | Typos, small fixes, minor copy/config changes |
| Medium | 150 | Standard features, involved bug fixes |
| High | 200 | Complex features, refactors, new integrations |

Each repo should maintain a mix — front-load Trivial/Medium issues for the first Wave to attract contributors, then layer in High-complexity issues once the codebase and contributor pool have matured.

---

## 7. Roadmap to Drips Wave Readiness

### Phase 0 — Foundation (Week 1)
- [x] Create `astral-loom` GitHub organization
- [x] Create all 3 repos (`astral-loom-kit`, `astral-loom-cli`, `astral-loom-widgets`)
- [x] Scaffold `astral-loom-kit` (v0.1 complete: network config, error mapping, transaction helpers, Freighter adapter)
- [ ] Push `astral-loom-kit` to GitHub
- [ ] Scaffold `astral-loom-cli`
- [ ] Scaffold `astral-loom-widgets`

### Phase 1 — Real Working Code (Weeks 1–2)
- [ ] Each repo has functional, tested, documented v0.1 code (not just boilerplate)
- [ ] Each repo has a clear README with install + usage examples
- [ ] Each repo has CONTRIBUTING.md with local setup instructions
- [ ] Each repo has a LICENSE (MIT)
- [ ] Basic CI (lint + test on PR) set up for all three, ideally via GitHub Actions

### Phase 2 — Issue Backlog (Week 2–3)
- [ ] Open 5–8 well-scoped issues per repo, spanning Trivial/Medium/High
- [ ] Each issue has: clear description, acceptance criteria, relevant file/module pointers
- [ ] Label issues consistently (`good first issue`, `help wanted`, complexity labels)
- [ ] No duplicate or vague issues — every issue should be independently completable

### Phase 3 — Drips Wave Onboarding (Week 3)
- [ ] Log into the Drips Wave app with GitHub
- [ ] Navigate to Maintainers → Orgs and Repos
- [ ] Install the Drips Wave GitHub App on the `astral-loom` organization
- [ ] Sync all 3 repos
- [ ] Apply each repo to the relevant Wave Program (e.g. Stellar Wave Program)
- [ ] Wait for approval — respond promptly to any organizer questions

### Phase 4 — First Active Wave (Ongoing)
- [ ] Monitor Maintainers → Issues dashboard daily during an active Wave
- [ ] Review and assign contributor applications quickly (speed is critical — contributors need runway to finish before the Wave ends)
- [ ] Review PRs promptly; merge and mark issues resolved to release Points
- [ ] Leave two-way reviews within the 14-day window after each issue closes
- [ ] Re-stock the issue backlog continuously so unresolved issues rolling into the next Wave don't become the only available work

### Phase 5 — Sustain & Grow (Ongoing)
- [ ] Track which issues attract contributors vs. sit stale; refine issue scoping accordingly
- [ ] Expand wallet adapters, CLI commands, and widget components based on real usage/requests
- [ ] Consider adding a docs site (e.g. Docusaurus) once the toolkit stabilizes
- [ ] Evaluate applying to additional/adjacent Wave Programs as the ecosystem grows

---

## 8. Success Metrics

- All 3 repos approved into at least one Wave Program
- At least 80% of open issues receive a contributor application within the first Wave cycle
- Median time from application to assignment under 48 hours
- Positive two-way review sentiment (maintainer ↔ contributor) sustained across cycles
- Issue backlog never runs dry between Waves

---

## 9. Open Questions

- Which specific Wave Program(s) should each repo target first? (Stellar Wave Program is the clear first candidate given the ecosystem fit)
- Should `astral-loom-widgets` support both React and Vue, or React-only for v1?
- Do we want a shared `astral-loom-core` types package eventually, to avoid type duplication across the three repos?

---

## 10. Appendix — Reference

- Drips Wave maintainer guide: https://docs.drips.network/wave/maintainers/participating-in-a-wave/
- Stellar SDK docs: https://developers.stellar.org/
