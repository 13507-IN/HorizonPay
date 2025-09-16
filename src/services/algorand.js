import algosdk from 'algosdk';

// Algorand client configuration
const algodToken = import.meta.env.VITE_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = import.meta.env.VITE_ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const algodPort = import.meta.env.VITE_ALGOD_PORT || 443;

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Asset configurations
export const ASSETS = {
  ALGO: { id: 0, decimals: 6 },
  USDC: { id: parseInt(import.meta.env.VITE_USDC_ASSET_ID) || 10458941, decimals: 6 },
  EURC: { id: parseInt(import.meta.env.VITE_EURC_ASSET_ID) || 227855942, decimals: 6 },
  BRZ: { id: parseInt(import.meta.env.VITE_BRZ_ASSET_ID) || 227855943, decimals: 6 },
  INR: { id: parseInt(import.meta.env.VITE_INR_ASSET_ID) || 227855944, decimals: 6 }
};

/**
 * Create an unsigned transaction for ASA transfer
 */
export async function createAssetTransferTransaction(senderAddress, recipientAddress, assetId, amount, note = '') {
  try {
    console.log('Creating asset transfer transaction with params:', {
      senderAddress,
      recipientAddress,
      assetId,
      amount,
      note,
      senderAddressType: typeof senderAddress,
      recipientAddressType: typeof recipientAddress,
      senderAddressLength: senderAddress?.length,
      recipientAddressLength: recipientAddress?.length
    });

    // Validate inputs
    if (!senderAddress || !recipientAddress || assetId === undefined || !amount) {
      throw new Error(`Missing required parameters: senderAddress=${senderAddress}, recipientAddress=${recipientAddress}, assetId=${assetId}, amount=${amount}`);
    }

    if (!algosdk.isValidAddress(senderAddress)) {
      throw new Error('Invalid sender address');
    }

    if (!algosdk.isValidAddress(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const params = await algodClient.getTransactionParams().do();
    console.log('Network params:', params);
    
    console.log('About to create transaction with:', {
      from: senderAddress,
      to: recipientAddress,
      amount: amount,
      assetIndex: assetId,
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams: params
    });

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: senderAddress,
      to: recipientAddress,
      amount: amount,
      assetIndex: assetId,
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams: params
    });

    console.log('Asset transfer transaction created successfully:', {
      txnId: txn.txID(),
      from: txn.from.toString(),
      to: txn.to.toString(),
      amount: txn.amount,
      assetIndex: txn.assetIndex
    });

    return {
      success: true,
      transaction: txn
    };
  } catch (error) {
    console.error('Create asset transfer transaction error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      fullError: error
    });
    return {
      success: false,
      error: error.message || 'Unknown error creating asset transaction'
    };
  }
}

/**
 * Create an unsigned transaction for ALGO transfer
 */
export async function createAlgoTransferTransaction(senderAddress, recipientAddress, amount, note = '') {
  try {
    console.log('Creating ALGO transaction with params:', {
      senderAddress,
      recipientAddress,
      amount,
      note,
      senderAddressType: typeof senderAddress,
      recipientAddressType: typeof recipientAddress,
      senderAddressLength: senderAddress?.length,
      recipientAddressLength: recipientAddress?.length
    });

    // Validate inputs
    if (!senderAddress || !recipientAddress || !amount) {
      throw new Error(`Missing required parameters: senderAddress=${senderAddress}, recipientAddress=${recipientAddress}, amount=${amount}`);
    }

    if (!algosdk.isValidAddress(senderAddress)) {
      throw new Error('Invalid sender address');
    }

    if (!algosdk.isValidAddress(recipientAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const params = await algodClient.getTransactionParams().do();
    console.log('Network params:', params);
    
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: senderAddress,
      to: recipientAddress,
      amount: amount,
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams: params
    });

    console.log('Transaction created successfully:', {
      txnId: txn.txID(),
      from: txn.from.toString(),
      to: txn.to.toString(),
      amount: txn.amount
    });

    return {
      success: true,
      transaction: txn
    };
  } catch (error) {
    console.error('Create ALGO transfer transaction error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      fullError: error
    });
    return {
      success: false,
      error: error.message || 'Unknown error creating ALGO transaction'
    };
  }
}

/**
 * Get account balance for specific asset
 */
export async function getAccountBalance(address, assetId = 0) {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    
    if (assetId === 0) {
      // ALGO balance
      return {
        success: true,
        balance: accountInfo.amount / 1000000 // Convert microAlgos to Algos
      };
    } else {
      // ASA balance
      const asset = accountInfo.assets.find(a => a['asset-id'] === assetId);
      if (asset) {
        return {
          success: true,
          balance: asset.amount / 1000000 // Assuming 6 decimals for most stablecoins
        };
      } else {
        return {
          success: true,
          balance: 0 // Account doesn't hold this asset
        };
      }
    }
  } catch (error) {
    console.error('Get account balance error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForConfirmation(txId, maxRounds = 10) {
  try {
    const status = await algosdk.waitForConfirmation(algodClient, txId, maxRounds);
    return {
      success: true,
      confirmedRound: status['confirmed-round'],
      txId: status.txn.txn.txid || txId
    };
  } catch (error) {
    console.error('Wait for confirmation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export { algodClient };
