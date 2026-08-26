
import { Transaction } from '@stellar/stellar-sdk';
import * as freighterIntent from '@stellar/freighter-api';
import type { AlbedoIntent } from '@albedo-link/intent';
const freighter = (freighterIntent as unknown as { default: typeof freighterIntent }).default || freighterIntent;
const { isConnected, requestAccess, getAddress, signTransaction } = freighter;
import { NetworkName, getNetwork } from '../network';
import { mapStellarError } from '../errors';

interface XBullSDK {
  connect(options: { canRequestPublicKey: boolean; canRequestSign: boolean }): Promise<string>;
  getPublicKey(): Promise<string | null>;
  signXDR(xdr: string, options: { network: string }): Promise<string>;
}

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

export class AlbedoAdapter implements WalletAdapter {
  private async getAlbedo(): Promise<AlbedoIntent> {
    const albedoIntent = await import('@albedo-link/intent');
    return (albedoIntent as unknown as { default: AlbedoIntent }).default || (albedoIntent as unknown as AlbedoIntent);
  }

  async connect(): Promise<string> {
    try {
      const albedo = await this.getAlbedo();
      const response = await albedo.publicKey({});
      return response.pubkey;
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async getPublicKey(): Promise<string | null> {
    // Albedo does not have a silent "get current key" without a prompt.
    return null;
  }

  async signTransaction(transaction: Transaction, network: NetworkName): Promise<string> {
    try {
      const albedo = await this.getAlbedo();
      const networkConfig = getNetwork(network);
      const response = await albedo.tx({
        xdr: transaction.toXDR(),
        network: networkConfig.networkPassphrase,
      });
      return response.signed_envelope_xdr;
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async isConnected(): Promise<boolean> {
    // Albedo is web-based, so it is always "installed" as long as the user has a browser
    return true;
  }
}

export class XBullAdapter implements WalletAdapter {
  private get xBull(): XBullSDK | undefined {
    return (window as Window & { xBullSDK?: XBullSDK }).xBullSDK;
  }

  async connect(): Promise<string> {
    try {
      if (!this.xBull) throw new Error('xBull is not installed.');
      return await this.xBull.connect({
        canRequestPublicKey: true,
        canRequestSign: true,
      });
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async getPublicKey(): Promise<string | null> {
    try {
      if (!this.xBull) return null;
      return await this.xBull.getPublicKey();
    } catch {
      return null;
    }
  }

  async signTransaction(transaction: Transaction, network: NetworkName): Promise<string> {
    try {
      if (!this.xBull) throw new Error('xBull is not installed.');
      const networkConfig = getNetwork(network);
      const signedXdr = await this.xBull.signXDR(transaction.toXDR(), {
        network: networkConfig.networkPassphrase,
      });
      return signedXdr;
    } catch (error) {
      throw mapStellarError(error);
    }
  }

  async isConnected(): Promise<boolean> {
    return !!this.xBull;
  }
}
