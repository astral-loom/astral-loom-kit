import { Transaction } from '@stellar/stellar-sdk';
import type { AlbedoIntent } from '@albedo-link/intent';
import { NetworkName, getNetwork } from '../network';
import { mapStellarError } from '../errors';
import { WalletAdapter } from './adapters';

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
