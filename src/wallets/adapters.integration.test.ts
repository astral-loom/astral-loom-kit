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
import { FreighterAdapter } from './adapters';
import type { WalletAdapter } from './adapters';
import type { NetworkName } from '../network';
import { MappedError, StellarErrorCode } from '../errors';

/**
 * `adapters.ts` destructures the Freighter API functions at module load time,
 * so the mock functions must exist before that module is evaluated — hence
 * `vi.hoisted`. The factory then re-exports the same instances as named
 * exports, which is what the adapter's namespace import picks up.
 */
const freighter = vi.hoisted(() => ({
  isConnected: vi.fn(),
  requestAccess: vi.fn(),
  getAddress: vi.fn(),
  signTransaction: vi.fn(),
}));

vi.mock('@stellar/freighter-api', () => ({ ...freighter, default: freighter }));

/** Key the simulated extension signs with. */
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

/** Wallet adapters reject with a plain `MappedError`, not an `Error`. */
async function captureRejection(promise: Promise<unknown>): Promise<MappedError> {
  try {
    await promise;
  } catch (error) {
    return error as MappedError;
  }
  throw new Error('Expected the promise to reject, but it resolved instead.');
}

describe('FreighterAdapter (integration)', () => {
  let adapter: WalletAdapter;

  beforeEach(() => {
    vi.resetAllMocks();
    adapter = new FreighterAdapter();
  });

  describe('connect()', () => {
    it('resolves with the address once the user grants access', async () => {
      const address = Keypair.random().publicKey();
      freighter.isConnected.mockResolvedValue({ isConnected: true });
      freighter.requestAccess.mockResolvedValue({ address });

      await expect(adapter.connect()).resolves.toBe(address);
      expect(freighter.requestAccess).toHaveBeenCalledTimes(1);
    });

    it('rejects without prompting when the extension is not installed', async () => {
      freighter.isConnected.mockResolvedValue({ isConnected: false });

      const error = await captureRejection(adapter.connect());

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Freighter is not installed or not available.');
      expect(freighter.requestAccess).not.toHaveBeenCalled();
    });

    it('rejects with a mapped error when the user denies access', async () => {
      freighter.isConnected.mockResolvedValue({ isConnected: true });
      freighter.requestAccess.mockResolvedValue({ error: 'User denied access' });

      const error = await captureRejection(adapter.connect());

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('User denied access');
    });

    it('treats a throwing extension API as not installed', async () => {
      freighter.isConnected.mockRejectedValue(new Error('Extension context invalidated'));

      await expect(adapter.isConnected()).resolves.toBe(false);

      const error = await captureRejection(adapter.connect());
      expect(error.message).toBe('Freighter is not installed or not available.');
    });
  });

  describe('signTransaction()', () => {
    it('returns a valid XDR envelope carrying the wallet signature', async () => {
      freighter.signTransaction.mockImplementation(
        async (xdr: string, opts?: { networkPassphrase?: string }) => {
          const parsed = TransactionBuilder.fromXDR(
            xdr,
            opts?.networkPassphrase ?? Networks.TESTNET,
          );
          parsed.sign(walletSigner);
          return { signedTxXdr: parsed.toXDR(), signerAddress: walletSigner.publicKey() };
        },
      );
      const tx = buildTransaction(Networks.TESTNET);

      const signedXdr = await adapter.signTransaction(tx, 'testnet');

      expect(freighter.signTransaction).toHaveBeenCalledWith(tx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });

      const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
      expect(signed.signatures).toHaveLength(1);
      expect(walletSigner.verify(signed.hash(), signed.signatures[0].signature)).toBe(true);
      expect(signedXdr).not.toBe(tx.toXDR());
    });

    it.each([
      ['testnet', Networks.TESTNET],
      ['mainnet', Networks.PUBLIC],
      ['futurenet', Networks.FUTURENET],
    ] as const)(
      'forwards the official %s network passphrase to the extension',
      async (network, passphrase) => {
        freighter.signTransaction.mockResolvedValue({ signedTxXdr: 'AAAA', signerAddress: 'G...' });
        const tx = buildTransaction(passphrase);

        await adapter.signTransaction(tx, network);

        expect(freighter.signTransaction).toHaveBeenCalledWith(tx.toXDR(), {
          networkPassphrase: passphrase,
        });
      },
    );

    it('rejects with a mapped error when the user declines to sign', async () => {
      freighter.signTransaction.mockResolvedValue({
        error: 'User declined to sign the transaction',
      });
      const tx = buildTransaction(Networks.TESTNET);

      const error = await captureRejection(adapter.signTransaction(tx, 'testnet'));

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('User declined to sign the transaction');
    });

    it('rejects with a mapped error when the network passphrase does not match', async () => {
      freighter.signTransaction.mockResolvedValue({
        error: 'Network passphrase mismatch: the transaction was built for a different network',
      });
      const mainnetTx = buildTransaction(Networks.PUBLIC);

      const error = await captureRejection(adapter.signTransaction(mainnetTx, 'mainnet'));

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toContain('Network passphrase mismatch');
    });

    it('rejects with a mapped error for an unknown network', async () => {
      const tx = buildTransaction(Networks.TESTNET);

      const error = await captureRejection(
        adapter.signTransaction(tx, 'stellarium' as NetworkName),
      );

      expect(error.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Unknown network: stellarium');
      expect(freighter.signTransaction).not.toHaveBeenCalled();
    });
  });

  describe('connection state', () => {
    it('getPublicKey() returns the address when already connected', async () => {
      const address = Keypair.random().publicKey();
      freighter.isConnected.mockResolvedValue({ isConnected: true });
      freighter.getAddress.mockResolvedValue({ address });

      await expect(adapter.getPublicKey()).resolves.toBe(address);
    });

    it('getPublicKey() returns null when not connected or on error', async () => {
      freighter.isConnected.mockResolvedValue({ isConnected: false });
      await expect(adapter.getPublicKey()).resolves.toBeNull();

      freighter.isConnected.mockResolvedValue({ isConnected: true });
      freighter.getAddress.mockRejectedValue(new Error('Extension context invalidated'));
      await expect(adapter.getPublicKey()).resolves.toBeNull();
    });

    it('isConnected() reflects the extension state', async () => {
      freighter.isConnected.mockResolvedValue({ isConnected: true });
      await expect(adapter.isConnected()).resolves.toBe(true);

      freighter.isConnected.mockResolvedValue({ isConnected: false });
      await expect(adapter.isConnected()).resolves.toBe(false);

      freighter.isConnected.mockResolvedValue({ error: 'Freighter is locked' });
      await expect(adapter.isConnected()).resolves.toBe(false);
    });
  });
});
