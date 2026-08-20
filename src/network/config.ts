import { Horizon } from '@stellar/stellar-sdk';

export type NetworkName = 'mainnet' | 'testnet' | 'futurenet';

export interface NetworkConfig {
  name: NetworkName;
  url: string;
  networkPassphrase: string;
}

export const NETWORK_PRESETS: Record<NetworkName, NetworkConfig> = {
  mainnet: {
    name: 'mainnet',
    url: 'https://horizon.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
  },
  testnet: {
    name: 'testnet',
    url: 'https://horizon-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
  },
  futurenet: {
    name: 'futurenet',
    url: 'https://horizon-futurenet.stellar.org',
    networkPassphrase: 'Test SDF Future Network ; Fall 2022',
  },
};

/**
 * Retrieves the network configuration for a given network name.
 */
export function getNetwork(name: NetworkName): NetworkConfig {
  const config = NETWORK_PRESETS[name];
  if (!config) {
    throw new Error(`Unknown network: ${name}`);
  }
  return config;
}

/**
 * Returns a configured Horizon Server instance for the given network name.
 */
export function switchNetwork(name: NetworkName): Horizon.Server {
  const config = getNetwork(name);
  return new Horizon.Server(config.url);
}
