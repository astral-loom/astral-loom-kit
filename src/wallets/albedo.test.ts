import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlbedoAdapter } from './albedo';
import { TransactionBuilder, Account, Networks } from '@stellar/stellar-sdk';

const mockPublicKey = vi.fn();
const mockTx = vi.fn();

vi.mock('@albedo-link/intent', () => {
  return {
    default: {
      publicKey: mockPublicKey,
      tx: mockTx,
    }
  };
});

describe('AlbedoAdapter', () => {
  let adapter: AlbedoAdapter;

  beforeEach(() => {
    adapter = new AlbedoAdapter();
    vi.clearAllMocks();
  });

  it('should connect and return a public key', async () => {
    mockPublicKey.mockResolvedValueOnce({ pubkey: 'GAAAA' });
    const pubkey = await adapter.connect();
    expect(pubkey).toBe('GAAAA');
    expect(mockPublicKey).toHaveBeenCalled();
  });

  it('should return null for getPublicKey', async () => {
    const pubkey = await adapter.getPublicKey();
    expect(pubkey).toBeNull();
  });

  it('should return true for isConnected', async () => {
    const connected = await adapter.isConnected();
    expect(connected).toBe(true);
  });

  it('should sign a transaction and return the signed XDR', async () => {
    mockTx.mockResolvedValueOnce({ signed_envelope_xdr: 'mock_signed_xdr' });
    
    const { Keypair } = await import('@stellar/stellar-sdk');
    const tx = new TransactionBuilder(new Account(Keypair.random().publicKey(), '1'), {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    }).setTimeout(0).build();

    const signedXdr = await adapter.signTransaction(tx, 'testnet');
    expect(signedXdr).toBe('mock_signed_xdr');
    expect(mockTx).toHaveBeenCalled();
  });
});
