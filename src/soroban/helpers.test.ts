import { describe, it, expect } from 'vitest';
import { buildInvokeContractTx, jsToScVal } from './helpers';
import { xdr } from '@stellar/stellar-sdk';

describe('Soroban Helpers', () => {
  it('should convert JS primitives to ScVal correctly', () => {
    const num = jsToScVal(42);
    expect(num instanceof xdr.ScVal).toBe(true);

    const str = jsToScVal('hello');
    expect(str instanceof xdr.ScVal).toBe(true);
  });

  it('should build a contract invocation transaction', () => {
    const tx = buildInvokeContractTx({
      contractId: 'CAZUSJDKMQDCPW2Z4ZTBEH5DP3Q5LVJXODP6OGXUVB2XDAEK4BPVAZGS',
      method: 'increment',
      args: [jsToScVal(1)],
      source: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      sourceSequence: '100',
      network: 'testnet',
    });

    expect(tx).toBeDefined();
    expect(tx.operations.length).toBe(1);
    expect(tx.operations[0].type).toBe('invokeHostFunction');
  });
});
