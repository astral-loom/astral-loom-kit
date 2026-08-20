export enum StellarErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  TRUSTLINE_NOT_ESTABLISHED = 'TRUSTLINE_NOT_ESTABLISHED',
  BAD_AUTH = 'BAD_AUTH',
  TRANSACTION_MALFORMED = 'TRANSACTION_MALFORMED',
  BAD_SEQUENCE = 'BAD_SEQUENCE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface MappedError {
  code: StellarErrorCode;
  message: string;
  originalError: unknown;
}

/**
 * Maps a raw Horizon or Stellar SDK error to a human-readable message and standard error code.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapStellarError(error: any): MappedError {
  const result: MappedError = {
    code: StellarErrorCode.UNKNOWN_ERROR,
    message: 'An unknown error occurred.',
    originalError: error,
  };

  if (!error) return result;

  // Check Horizon response errors
  if (error.response && error.response.data) {
    const data = error.response.data;
    const extras = data.extras;

    if (data.status === 400 && data.title === 'Transaction Malformed') {
      result.code = StellarErrorCode.TRANSACTION_MALFORMED;
      result.message = 'The transaction is malformed and could not be processed.';
    }

    if (extras && extras.result_codes) {
      const txCode = extras.result_codes.transaction;
      const opCodes = extras.result_codes.operations || [];

      if (txCode === 'tx_bad_seq') {
        result.code = StellarErrorCode.BAD_SEQUENCE;
        result.message = 'Transaction sequence number is invalid. Please refresh and try again.';
      } else if (txCode === 'tx_bad_auth') {
        result.code = StellarErrorCode.BAD_AUTH;
        result.message = 'Transaction authorization failed. Check your signature.';
      }

      // Check operation codes
      if (opCodes.includes('op_underfunded')) {
        result.code = StellarErrorCode.INSUFFICIENT_BALANCE;
        result.message = 'Insufficient balance to complete this operation.';
      } else if (opCodes.includes('op_no_trust')) {
        result.code = StellarErrorCode.TRUSTLINE_NOT_ESTABLISHED;
        result.message = 'Trustline not established for the asset.';
      }
    }
  } else if (error.message) {
    // Basic string matching as fallback
    const msg = error.message.toLowerCase();
    if (msg.includes('insufficient balance') || msg.includes('underfunded')) {
      result.code = StellarErrorCode.INSUFFICIENT_BALANCE;
      result.message = 'Insufficient balance to complete this operation.';
    } else if (msg.includes('no trust') || msg.includes('trustline not established')) {
      result.code = StellarErrorCode.TRUSTLINE_NOT_ESTABLISHED;
      result.message = 'Trustline not established for the asset.';
    } else if (msg.includes('bad auth') || msg.includes('signature')) {
      result.code = StellarErrorCode.BAD_AUTH;
      result.message = 'Transaction authorization failed. Check your signature.';
    } else if (msg.includes('bad sequence')) {
      result.code = StellarErrorCode.BAD_SEQUENCE;
      result.message = 'Transaction sequence number is invalid. Please refresh and try again.';
    }
  }

  return result;
}
