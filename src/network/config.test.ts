import { describe, it, expect } from 'vitest';
import { getNetwork, switchNetwork } from './config';
import { Horizon } from '@stellar/stellar-sdk';

describe('Network Config', () => {
  it('should return mainnet config', () => {
    const config = getNetwork('mainnet');
    expect(config.name).toBe('mainnet');
    expect(config.url).toBe('https://horizon.stellar.org');
    expect(config.networkPassphrase).toBe('Public Global Stellar Network ; September 2015');
  });

  it('should return testnet config', () => {
    const config = getNetwork('testnet');
    expect(config.name).toBe('testnet');
    expect(config.url).toBe('https://horizon-testnet.stellar.org');
    expect(config.networkPassphrase).toBe('Test SDF Network ; September 2015');
  });

  it('should throw on invalid network', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => getNetwork('invalid' as any)).toThrow('Unknown network: invalid');
  });

  it('should return Horizon Server instance on switchNetwork', () => {
    const server = switchNetwork('testnet');
    expect(server).toBeInstanceOf(Horizon.Server);
    expect(server.serverURL.toString()).toBe('https://horizon-testnet.stellar.org/');
  });
});
