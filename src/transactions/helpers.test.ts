import { describe, it, expect } from 'vitest';
import { Asset, Transaction } from '@stellar/stellar-sdk';
import {
  buildPayment,
  buildTrustline,
  buildBatchPayment,
  buildPathPayment,
} from './helpers';

const SOURCE = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
const SOURCE_SEQUENCE = '100';
const DESTINATION = 'GDRRQ77V3XZCIH5BFNGNDRVUZAXXX4X2DMF6DSTVPSTG6BV2Z6ET6TGC';
const ISSUER = 'GDRRQ77V3XZCIH5BFNGNDRVUZAXXX4X2DMF6DSTVPSTG6BV2Z6ET6TGC';
const NETWORK = 'testnet' as const;

describe('buildPayment', () => {
  it('should build a native XLM payment transaction', () => {
    const tx = buildPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      destination: DESTINATION,
      assetCode: 'XLM',
      amount: '10',
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(1);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.payment>;
    expect(op.type).toBe('payment');
    expect(op.destination).toBe(DESTINATION);
    expect(op.asset.isNative()).toBe(true);
    expect(op.amount).toBe('10.0000000');
  });

  it('should build a custom asset payment transaction', () => {
    const tx = buildPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      destination: DESTINATION,
      assetCode: 'USDC',
      assetIssuer: ISSUER,
      amount: '50',
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(1);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.payment>;
    expect(op.type).toBe('payment');
    expect(op.asset.code).toBe('USDC');
    expect(op.asset.issuer).toBe(ISSUER);
    expect(op.amount).toBe('50.0000000');
  });

  it('should use a custom fee when provided', () => {
    const tx = buildPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      destination: DESTINATION,
      assetCode: 'XLM',
      amount: '1',
      network: NETWORK,
      fee: '200',
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.fee).toBe('200');
  });

  it('should throw when destination is invalid', () => {
    expect(() =>
      buildPayment({
        source: SOURCE,
        sourceSequence: SOURCE_SEQUENCE,
        destination: 'INVALID_DESTINATION',
        assetCode: 'XLM',
        amount: '10',
        network: NETWORK,
      }),
    ).toThrow();
  });

  it('should throw when amount is invalid', () => {
    expect(() =>
      buildPayment({
        source: SOURCE,
        sourceSequence: SOURCE_SEQUENCE,
        destination: DESTINATION,
        assetCode: 'XLM',
        amount: 'not-a-number',
        network: NETWORK,
      }),
    ).toThrow();
  });
});

describe('buildTrustline', () => {
  it('should build a change trust transaction', () => {
    const tx = buildTrustline({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      assetCode: 'USDC',
      assetIssuer: ISSUER,
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(1);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.changeTrust>;
    expect(op.type).toBe('changeTrust');
    expect((op.line as Asset).code).toBe('USDC');
    expect((op.line as Asset).issuer).toBe(ISSUER);
  });

  it('should build a change trust transaction with a custom limit', () => {
    const tx = buildTrustline({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      assetCode: 'USDC',
      assetIssuer: ISSUER,
      limit: '1000',
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.changeTrust>;
    expect(op.limit).toBe('1000.0000000');
  });
});

describe('buildBatchPayment', () => {
  it('should build a batch payment transaction with multiple destinations', () => {
    const destinations = [
      { destination: DESTINATION, amount: '10' },
      { destination: 'GC5CNZEJQ4H3POKNXUGKCN7HM63VTDDGMODXAY2CSTNMD53PT2IKS5X3', amount: '20' },
    ];

    const tx = buildBatchPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      assetCode: 'XLM',
      destinations,
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(destinations.length);
    tx.operations.forEach((op, idx) => {
      expect(op.type).toBe('payment');
      const paymentOp = op as ReturnType<typeof import('@stellar/stellar-sdk').Operation.payment>;
      expect(paymentOp.destination).toBe(destinations[idx].destination);
      expect(paymentOp.amount).toBe(Number(destinations[idx].amount).toFixed(7));
    });
  });

  it('should build a batch payment for a custom asset', () => {
    const destinations = [
      { destination: DESTINATION, amount: '5' },
      { destination: 'GC5CNZEJQ4H3POKNXUGKCN7HM63VTDDGMODXAY2CSTNMD53PT2IKS5X3', amount: '15' },
      { destination: 'GBYLSU567BG4LX3EHNH2BD6WYWR2MQJ35NIVQZ35Y6CCRBWUHA2T6RXF', amount: '25' },
    ];

    const tx = buildBatchPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      assetCode: 'USDC',
      assetIssuer: ISSUER,
      destinations,
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(3);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.payment>;
    expect(op.asset.code).toBe('USDC');
    expect(op.asset.issuer).toBe(ISSUER);
  });

  it('operation count matches the number of destinations', () => {
    const destinations = [
      { destination: DESTINATION, amount: '1' },
      { destination: 'GC5CNZEJQ4H3POKNXUGKCN7HM63VTDDGMODXAY2CSTNMD53PT2IKS5X3', amount: '2' },
      { destination: 'GBYLSU567BG4LX3EHNH2BD6WYWR2MQJ35NIVQZ35Y6CCRBWUHA2T6RXF', amount: '3' },
      { destination: 'GCS4ILSCZ6NKF24TSJIEBNQWGCD7HZWPX5I7NRYRLZCVFKYO55MTNMCD', amount: '4' },
    ];

    const tx = buildBatchPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      assetCode: 'XLM',
      destinations,
      network: NETWORK,
    });

    expect(tx.operations).toHaveLength(destinations.length);
  });
});

describe('buildPathPayment', () => {
  it('should build a path payment strict receive transaction with an empty path', () => {
    const tx = buildPathPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      sendAssetCode: 'XLM',
      sendMax: '100',
      destination: DESTINATION,
      destAssetCode: 'USDC',
      destAssetIssuer: ISSUER,
      destAmount: '50',
      path: [],
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    expect(tx.operations).toHaveLength(1);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.pathPaymentStrictReceive>;
    expect(op.type).toBe('pathPaymentStrictReceive');
    expect(op.sendAsset.isNative()).toBe(true);
    expect(op.sendMax).toBe('100.0000000');
    expect(op.destination).toBe(DESTINATION);
    expect(op.destAsset.code).toBe('USDC');
    expect(op.destAmount).toBe('50.0000000');
    expect(op.path).toHaveLength(0);
  });

  it('should build a path payment with custom send and dest assets', () => {
    const sendIssuer = 'GC5CNZEJQ4H3POKNXUGKCN7HM63VTDDGMODXAY2CSTNMD53PT2IKS5X3';

    const tx = buildPathPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      sendAssetCode: 'EUR',
      sendAssetIssuer: sendIssuer,
      sendMax: '200',
      destination: DESTINATION,
      destAssetCode: 'USDC',
      destAssetIssuer: ISSUER,
      destAmount: '150',
      path: [],
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.pathPaymentStrictReceive>;
    expect(op.sendAsset.code).toBe('EUR');
    expect(op.sendAsset.issuer).toBe(sendIssuer);
  });

  it('should default path to empty array when not provided', () => {
    const tx = buildPathPayment({
      source: SOURCE,
      sourceSequence: SOURCE_SEQUENCE,
      sendAssetCode: 'XLM',
      sendMax: '10',
      destination: DESTINATION,
      destAssetCode: 'USDC',
      destAssetIssuer: ISSUER,
      destAmount: '5',
      network: NETWORK,
    });

    expect(tx).toBeInstanceOf(Transaction);
    const op = tx.operations[0] as ReturnType<typeof import('@stellar/stellar-sdk').Operation.pathPaymentStrictReceive>;
    expect(op.path).toHaveLength(0);
  });
});
