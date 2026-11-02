import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  Account,
  Asset,
  Keypair,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { AlbedoAdapter } from './albedo';
import type { WalletAdapter } from './adapters';
import type { NetworkName } from '../network';
import { MappedError, StellarErrorCode } from '../errors';

/**
 * `AlbedoAdapter` loads `@albedo-link/intent` through a dynamic import, so the
 * mock exposes `default` via a getter. The getter lets a single test simulate
 * the intent library being unavailable (blocked, offline, failed install)
 * without disturbing the other tests in this file.
 */
const albedo = vi.hoisted(() => ({
  publicKey: vi.fn(),
  tx: vi.fn(),
  libraryAvailable: true,
}));

vi.mock('@albedo-link/intent', () => ({
  get default() {
    if (!albedo.libraryAvailable) {
      throw new Error('Cannot find module "@albedo-link/intent"');
    }
    return { publicKey: albedo.publicKey, tx: albedo.tx };
  },
}));

/** Key the simulated wallet signs with. */
const walletSigner = Keypair.random();

function buildTransaction(passphrase: string): Transaction {
  const source = Keypair.random();
  return new TransactionBuilder(new Account(source.publicKey(), '42'), {
    fee: '100',
    networkPassphrase: passphrase,
  })
    .addOperation(
      Operation.payment({
        destination: Keypair.random().publicKey(),
        asset: Asset.native(),
        amount: '25',
      }),
    )
    .setTimeout(0)
    .build();
}

/**
 * Wallet adapters reject with a plain `MappedError` object rather than an
 * `Error`, so `rejects.toThrow()` cannot be used — capture the rejection
 * directly instead.
 */
async function captureRejection(promise: Promise<unknown>): Promise<MappedError> {
  try {
    await promise;
  } catch (error) {
    return error as MappedError;
  }
  throw new Error('Expected the promise to reject, but it resolved instead.');
}

/** Simulates an Albedo popup that is pinned to a single network. */
function mockWalletPinnedTo(passphrase: string): void {
  albedo.tx.mockImplementation(async ({ xdr, network }: { xdr: string; network: string }) => {
    if (network !== passphrase) {
      throw {
        message: `Network passphrase mismatch: the wallet is connected to a different network than "${network}".`,
        code: -3,
      };
    }
    const parsed = TransactionBuilder.fromXDR(xdr, network);
    parsed.sign(walletSigner);
    return {
      xdr,
      tx_hash: Buffer.from(parsed.hash()).toString('hex'),
      signed_envelope_xdr: parsed.toXDR(),
      network,
      result: {},
    };
  });
}

describe('AlbedoAdapter (integration)', () => {
  let adapter: WalletAdapter;

  beforeEach(() => {
    vi.resetAllMocks();
    albedo.libraryAvailable = true;
    adapter = new AlbedoAdapter();
  });

  describe('connect()', () => {
    it('resolves with the public key returned by Albedo', async () => {
      const pubkey = Keypair.random().publicKey();
      albedo.publicKey.mockResolvedValue({
        pubkey,
        signed_message: 'deadbeef',
        signature: 'cafebabe',
      });

      await expect(adapter.connect()).resolves.toBe(pubkey);
      expect(albedo.publicKey).toHaveBeenCalledTimes(1);
    });

    it('rejects with a mapped error when the intent library is unavailable', async () => {
      albedo.libraryAvailable = false;

      const error = await captureRejection(adapter.connect());

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toContain('Cannot find module "@albedo-link/intent"');
    });

    it('rejects with a mapped error when the user closes the Albedo prompt', async () => {
      const rejection = { message: 'Action request was rejected by the user.', code: -4 };
      albedo.publicKey.mockRejectedValue(rejection);

      const error = await captureRejection(adapter.connect());

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Action request was rejected by the user.');
      expect(error.originalError).toBe(rejection);
    });
  });

  describe('signTransaction()', () => {
    it('returns a valid XDR envelope carrying the wallet signature', async () => {
      mockWalletPinnedTo(Networks.TESTNET);
      const tx = buildTransaction(Networks.TESTNET);

      const signedXdr = await adapter.signTransaction(tx, 'testnet');

      expect(albedo.tx).toHaveBeenCalledWith({
        xdr: tx.toXDR(),
        network: Networks.TESTNET,
      });

      const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
      expect(signed.signatures).toHaveLength(1);
      expect(walletSigner.verify(signed.hash(), signed.signatures[0].signature)).toBe(true);
      // The envelope changed: it now carries a signature the original did not.
      expect(signedXdr).not.toBe(tx.toXDR());
    });

    it.each([
      ['testnet', Networks.TESTNET],
      ['mainnet', Networks.PUBLIC],
      ['futurenet', Networks.FUTURENET],
    ] as const)(
      'forwards the official %s network passphrase to the wallet',
      async (network, passphrase) => {
        albedo.tx.mockResolvedValue({ signed_envelope_xdr: 'AAAA' });
        const tx = buildTransaction(passphrase);

        await adapter.signTransaction(tx, network);

        expect(albedo.tx).toHaveBeenCalledWith({ xdr: tx.toXDR(), network: passphrase });
      },
    );

    it('rejects with a mapped error when the network passphrase does not match', async () => {
      mockWalletPinnedTo(Networks.TESTNET);
      const mainnetTx = buildTransaction(Networks.PUBLIC);

      const error = await captureRejection(adapter.signTransaction(mainnetTx, 'mainnet'));

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toContain('Network passphrase mismatch');
      expect(albedo.tx).toHaveBeenCalledWith({ xdr: mainnetTx.toXDR(), network: Networks.PUBLIC });
    });

    it('rejects with a mapped error when the user declines to sign', async () => {
      const rejection = { message: 'Action request was rejected by the user.', code: -4 };
      albedo.tx.mockRejectedValue(rejection);
      const tx = buildTransaction(Networks.TESTNET);

      const error = await captureRejection(adapter.signTransaction(tx, 'testnet'));

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Action request was rejected by the user.');
      expect(error.originalError).toBe(rejection);
    });

    it('rejects with a mapped error for an unknown network', async () => {
      const tx = buildTransaction(Networks.TESTNET);

      const error = await captureRejection(
        adapter.signTransaction(tx, 'stellarium' as NetworkName),
      );

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Unknown network: stellarium');
    });
  });
});
