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
      contractId: 'CACQQJZZWWQ3U6TYTNG46J6D6Z7XUYZN32I5V6UUTP6R457N75XYIWTF',
      method: 'increment',
      args: [jsToScVal(1)],
      source: 'GA6L7D63QJYYZBYCDBYQYJ4XN2O4S7JFYR53UKN673F6N5B2F5C6Y47X',
      sourceSequence: '100',
      network: 'testnet',
    });

    expect(tx).toBeDefined();
    expect(tx.operations.length).toBe(1);
    expect(tx.operations[0].type).toBe('invokeHostFunction');
  });
});
