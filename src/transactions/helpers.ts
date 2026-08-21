import { TransactionBuilder, Asset, Operation, Account, BASE_FEE } from '@stellar/stellar-sdk';
import { getNetwork, NetworkName } from '../network';
import { mapStellarError } from '../errors';

export interface BuildPaymentParams {
  source: string;
  sourceSequence: string; // Add sourceSequence for building transaction
  destination: string;
  assetCode: string;
  assetIssuer?: string;
  amount: string;
  network: NetworkName;
  fee?: string;
}

export function buildPayment(params: BuildPaymentParams) {
  try {
    const { source, sourceSequence, destination, assetCode, assetIssuer, amount, network, fee } =
      params;
    const networkConfig = getNetwork(network);

    const asset =
      assetCode.toUpperCase() === 'XLM' && !assetIssuer
        ? Asset.native()
        : new Asset(assetCode, assetIssuer!);

    const account = new Account(source, sourceSequence);

    const transaction = new TransactionBuilder(account, {
      fee: fee || BASE_FEE,
      networkPassphrase: networkConfig.networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination,
          asset,
          amount,
        }),
      )
      .setTimeout(0) // Good default for building without immediate submission
      .build();

    return transaction;
  } catch (error) {
    throw mapStellarError(error);
  }
}

export interface BuildTrustlineParams {
  source: string;
  sourceSequence: string;
  assetCode: string;
  assetIssuer: string;
  limit?: string;
  network: NetworkName;
  fee?: string;
}

export function buildTrustline(params: BuildTrustlineParams) {
  try {
    const { source, sourceSequence, assetCode, assetIssuer, limit, network, fee } = params;
    const networkConfig = getNetwork(network);

    const asset = new Asset(assetCode, assetIssuer);
    const account = new Account(source, sourceSequence);

    const transaction = new TransactionBuilder(account, {
      fee: fee || BASE_FEE,
      networkPassphrase: networkConfig.networkPassphrase,
    })
      .addOperation(
        Operation.changeTrust({
          asset,
          limit,
        }),
      )
      .setTimeout(0)
      .build();

    return transaction;
  } catch (error) {
    throw mapStellarError(error);
  }
}

export interface BatchPaymentDestination {
  destination: string;
  amount: string;
}

export interface BuildBatchPaymentParams {
  source: string;
  sourceSequence: string;
  assetCode: string;
  assetIssuer?: string;
  destinations: BatchPaymentDestination[];
  network: NetworkName;
  fee?: string;
}

export function buildBatchPayment(params: BuildBatchPaymentParams) {
  try {
    const { source, sourceSequence, assetCode, assetIssuer, destinations, network, fee } = params;
    const networkConfig = getNetwork(network);

    const asset =
      assetCode.toUpperCase() === 'XLM' && !assetIssuer
        ? Asset.native()
        : new Asset(assetCode, assetIssuer!);

    const account = new Account(source, sourceSequence);
    const builder = new TransactionBuilder(account, {
      fee: fee || BASE_FEE,
      networkPassphrase: networkConfig.networkPassphrase,
    });

    for (const dest of destinations) {
      builder.addOperation(
        Operation.payment({
          destination: dest.destination,
          asset,
          amount: dest.amount,
        }),
      );
    }

    return builder.setTimeout(0).build();
  } catch (error) {
    throw mapStellarError(error);
  }
}

export interface BuildPathPaymentParams {
  source: string;
  sourceSequence: string;
  sendAssetCode: string;
  sendAssetIssuer?: string;
  sendMax: string;
  destination: string;
  destAssetCode: string;
  destAssetIssuer?: string;
  destAmount: string;
  path?: Asset[];
  network: NetworkName;
  fee?: string;
}

export function buildPathPayment(params: BuildPathPaymentParams) {
  try {
    const {
      source,
      sourceSequence,
      sendAssetCode,
      sendAssetIssuer,
      sendMax,
      destination,
      destAssetCode,
      destAssetIssuer,
      destAmount,
      path,
      network,
      fee,
    } = params;
    
    const networkConfig = getNetwork(network);

    const sendAsset =
      sendAssetCode.toUpperCase() === 'XLM' && !sendAssetIssuer
        ? Asset.native()
        : new Asset(sendAssetCode, sendAssetIssuer!);

    const destAsset =
      destAssetCode.toUpperCase() === 'XLM' && !destAssetIssuer
        ? Asset.native()
        : new Asset(destAssetCode, destAssetIssuer!);

    const account = new Account(source, sourceSequence);

    const transaction = new TransactionBuilder(account, {
      fee: fee || BASE_FEE,
      networkPassphrase: networkConfig.networkPassphrase,
    })
      .addOperation(
        Operation.pathPaymentStrictReceive({
          sendAsset,
          sendMax,
          destination,
          destAsset,
          destAmount,
          path: path || [],
        }),
      )
      .setTimeout(0)
      .build();

    return transaction;
  } catch (error) {
    throw mapStellarError(error);
  }
}
