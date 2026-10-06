import { Contract, TransactionBuilder, xdr, Account, BASE_FEE, nativeToScVal } from '@stellar/stellar-sdk';
import { getNetwork, NetworkName } from '../network';
import { mapStellarError } from '../errors';

export interface InvokeContractParams {
  contractId: string;
  method: string;
  args?: xdr.ScVal[];
  source: string;
  sourceSequence: string;
  network: NetworkName;
  fee?: string;
}

/**
 * Builds a Soroban contract invocation transaction.
 * Note: This creates the transaction, but you typically need to simulate it 
 * using SorobanRpc before signing and submitting.
 */
export function buildInvokeContractTx(params: InvokeContractParams) {
  try {
    const { contractId, method, args = [], source, sourceSequence, network, fee } = params;
    const networkConfig = getNetwork(network);

    const contract = new Contract(contractId);
    const account = new Account(source, sourceSequence);

    const transaction = new TransactionBuilder(account, {
      fee: fee || BASE_FEE,
      networkPassphrase: networkConfig.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(0) // Should be updated post-simulation
      .build();

    return transaction;
  } catch (error) {
    throw mapStellarError(error);
  }
}

/**
 * Helper to convert common JS types to ScVal
 */
export function jsToScVal(val: any): xdr.ScVal {
  return nativeToScVal(val);
}
