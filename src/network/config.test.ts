import { describe, it, expect } from 'vitest';
import { getNetwork, switchNetwork } from './config';
import { Horizon, Networks } from '@stellar/stellar-sdk';

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

  it('should return futurenet config', () => {
    const config = getNetwork('futurenet');
    expect(config.name).toBe('futurenet');
    expect(config.url).toBe('https://horizon-futurenet.stellar.org');
    // Must match the official passphrase — a wrong value silently produces
    // signatures that the network rejects (see Networks.FUTURENET in the SDK).
    expect(config.networkPassphrase).toBe(Networks.FUTURENET);
    expect(config.networkPassphrase).toBe('Test SDF Future Network ; October 2022');
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
