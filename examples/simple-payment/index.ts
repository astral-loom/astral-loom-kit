import { getNetwork, buildPayment, mapStellarError } from '../../dist/index.js';

async function main() {
  try {
    console.log('Fetching network config for testnet...');
    const network = getNetwork('testnet');
    console.log('Connected to:', network.url);

    console.log('\nBuilding a payment transaction...');
    // Replace with actual keys and sequence numbers for a real transaction
    const tx = buildPayment({
      source: 'GBOQWQOJ7D365F5C3LHTDOKP72KUXHTN3P7D77K4R6X3NBYHHLHYHTM5',
      sourceSequence: '1234567890',
      destination: 'GCMT4P2ONJUBIUKD43UUG4D6PBYVBNQGMW3Y6IHDNBNGDBT7E76L32C3',
      assetCode: 'XLM',
      amount: '10.5',
      network: 'testnet'
    });

    console.log('Transaction built successfully!');
    console.log('XDR:', tx.toEnvelope().toXDR('base64'));
    
    console.log('\nSimulating an error...');
    // Deliberately cause an error (invalid amount format)
    buildPayment({
      source: 'GBOQWQOJ7D365F5C3LHTDOKP72KUXHTN3P7D77K4R6X3NBYHHLHYHTM5',
      sourceSequence: '1',
      destination: 'GCMT4P2ONJUBIUKD43UUG4D6PBYVBNQGMW3Y6IHDNBNGDBT7E76L32C3',
      assetCode: 'XLM',
      amount: '-5.0', // invalid amount
      network: 'testnet'
    });
    
  } catch (error) {
    const mappedError = mapStellarError(error);
    console.error('Caught mapped error:', mappedError.message);
    if (mappedError.originalError) {
      console.error('Original type:', typeof mappedError.originalError);
    }
  }
}

main();
