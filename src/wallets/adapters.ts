import { Transaction } from '@stellar/stellar-sdk';
import { isConnected, requestAccess, getAddress, signTransaction } from '@stellar/freighter-api';
import { NetworkName, getNetwork } from '../network';
import { mapStellarError } from '../errors';

/**
 * Interface for Wallet Adapters.
 * Implement this interface to add support for new wallets (e.g., Albedo, xBull).
 */
export interface WalletAdapter {
  /** Connects to the wallet and returns the public key */
  connect(): Promise<string>;
  /** Gets the public key if already connected */
  getPublicKey(): Promise<string | null>;
  /** Signs a transaction */
  signTransaction(transaction: Transaction, network: NetworkName): Promise<string>;
  /** Checks if the wallet is connected */
  isConnected(): Promise<boolean>;
}

export class FreighterAdapter implements WalletAdapter {
  async connect(): Promise<string> {
    try {
      const connected = await this.isConnected();
      if (!connected) {
        throw new Error('Freighter is not installed or not available.');
      }
      const response = await requestAccess();
      if (response.error) throw new Error(response.error as string);
      return response.address;
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async getPublicKey(): Promise<string | null> {
    try {
      const connected = await this.isConnected();
      if (!connected) return null;
      const response = await getAddress();
      if (response.error) return null;
      return response.address;
    } catch {
      return null;
    }
  }

  async signTransaction(transaction: Transaction, network: NetworkName): Promise<string> {
    try {
      const networkConfig = getNetwork(network);
      const response = await signTransaction(transaction.toXDR(), {
        networkPassphrase: networkConfig.networkPassphrase,
      });
      if (response.error) throw new Error(response.error as string);
      return response.signedTxXdr;
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      const response = await isConnected();
      if (response.error) return false;
      return response.isConnected;
    } catch {
      return false;
    }
  }
}
