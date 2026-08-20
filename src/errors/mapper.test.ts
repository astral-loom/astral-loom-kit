import { describe, it, expect } from 'vitest';
import { mapStellarError, StellarErrorCode } from './mapper';

describe('Error Mapper', () => {
  it('should map unknown error', () => {
    const error = new Error('Random error');
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.UNKNOWN_ERROR);
    expect(mapped.originalError).toBe(error);
  });

  it('should map malformed transaction error', () => {
    const error = {
      response: {
        data: {
          status: 400,
          title: 'Transaction Malformed',
        },
      },
    };
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.TRANSACTION_MALFORMED);
  });

  it('should map tx_bad_seq error', () => {
    const error = {
      response: {
        data: {
          extras: {
            result_codes: {
              transaction: 'tx_bad_seq',
            },
          },
        },
      },
    };
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.BAD_SEQUENCE);
  });

  it('should map tx_bad_auth error', () => {
    const error = {
      response: {
        data: {
          extras: {
            result_codes: {
              transaction: 'tx_bad_auth',
            },
          },
        },
      },
    };
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.BAD_AUTH);
  });

  it('should map op_underfunded error', () => {
    const error = {
      response: {
        data: {
          extras: {
            result_codes: {
              operations: ['op_success', 'op_underfunded'],
            },
          },
        },
      },
    };
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.INSUFFICIENT_BALANCE);
  });

  it('should map op_no_trust error', () => {
    const error = {
      response: {
        data: {
          extras: {
            result_codes: {
              operations: ['op_no_trust'],
            },
          },
        },
      },
    };
    const mapped = mapStellarError(error);
    expect(mapped.code).toBe(StellarErrorCode.TRUSTLINE_NOT_ESTABLISHED);
  });

  it('should map string matching errors as fallback', () => {
    const error1 = new Error('Insufficient balance in account');
    const mapped1 = mapStellarError(error1);
    expect(mapped1.code).toBe(StellarErrorCode.INSUFFICIENT_BALANCE);

    const error2 = new Error('Trustline not established');
    const mapped2 = mapStellarError(error2);
    expect(mapped2.code).toBe(StellarErrorCode.TRUSTLINE_NOT_ESTABLISHED);

    const error3 = new Error('Bad auth');
    const mapped3 = mapStellarError(error3);
    expect(mapped3.code).toBe(StellarErrorCode.BAD_AUTH);

    const error4 = new Error('Bad sequence number');
    const mapped4 = mapStellarError(error4);
    expect(mapped4.code).toBe(StellarErrorCode.BAD_SEQUENCE);
  });
});
