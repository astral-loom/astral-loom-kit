import { getNetwork, buildPayment, mapStellarError } from '../../dist/index.mjs';
async function main() {
    try {
        console.log('Fetching network config for testnet...');
        const network = getNetwork('testnet');
        console.log('Connected to:', network.url);
        console.log('\nBuilding a payment transaction...');
        // Replace with actual keys and sequence numbers for a real transaction
        const tx = buildPayment({
            source: 'GBIKE5KTLWUGM35AHS4XWDCFJXW3KOOAPOMLGD72JKRSEI7EXCJ2ZBPO',
            sourceSequence: '1234567890',
            destination: 'GAXZZRBJFU22FOOXQFEUBQDNPANK2RL2IER2T4RG5RLMM32ZG3KISGVD',
            assetCode: 'XLM',
            amount: '10.5',
            network: 'testnet'
        });
        console.log('Transaction built successfully!');
        console.log('XDR:', tx.toEnvelope().toXDR('base64'));
        console.log('\nSimulating an error...');
        // Deliberately cause an error (invalid amount format)
        buildPayment({
            source: 'GBIKE5KTLWUGM35AHS4XWDCFJXW3KOOAPOMLGD72JKRSEI7EXCJ2ZBPO',
            sourceSequence: '1',
            destination: 'GAXZZRBJFU22FOOXQFEUBQDNPANK2RL2IER2T4RG5RLMM32ZG3KISGVD',
            assetCode: 'XLM',
            amount: '-5.0', // invalid amount
            network: 'testnet'
        });
    }
    catch (error) {
        const mappedError = mapStellarError(error);
        console.error('Caught mapped error:', mappedError.message);
        if (mappedError.originalError) {
            console.error('Original error:', mappedError.originalError);
        }
    }
}
main();
