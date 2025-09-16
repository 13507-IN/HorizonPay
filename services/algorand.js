const algosdk = require('algosdk');

// Algorand client configuration
const algodToken = process.env.ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const algodServer = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
const algodPort = process.env.ALGOD_PORT || 443;

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Asset configurations
const ASSETS = {
  ALGO: { id: 0, decimals: 6 },
  USDC: { id: parseInt(process.env.USDC_ASSET_ID) || 10458941, decimals: 6 },
  EURC: { id: parseInt(process.env.EURC_ASSET_ID) || 227855942, decimals: 6 },
  BRZ: { id: parseInt(process.env.BRZ_ASSET_ID) || 227855943, decimals: 6 },
  INR: { id: parseInt(process.env.INR_ASSET_ID) || 227855944, decimals: 6 }
};

/**
 * Submit a signed transaction to the Algorand network
 */
async function sendTransaction(signedTxnBlob) {
  try {
    // Decode the signed transaction
    const signedTxn = algosdk.decodeSignedTransaction(Buffer.from(signedTxnBlob, 'base64'));
    
    // Submit to network
    const { txId } = await algodClient.sendRawTransaction(signedTxnBlob).do();
    
    return {
      success: true,
      txId: txId
    };
  } catch (error) {
    console.error('Send transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get transaction status from the blockchain
 */
async function getTransactionStatus(txId) {
  try {
    const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
    
    if (pendingInfo['confirmed-round']) {
      return {
        success: true,
        status: 'confirmed',
        confirmations: 1,
        blockNumber: pendingInfo['confirmed-round']
      };
    } else {
      return {
        success: true,
        status: 'pending',
        confirmations: 0
      };
    }
  } catch (error) {
    // If transaction is not found in pending, it might be confirmed
    try {
      const accountInfo = await algodClient.accountInformation(txId).do();
      return {
        success: true,
        status: 'confirmed',
        confirmations: 1
      };
    } catch (innerError) {
      console.error('Get transaction status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Create an unsigned transaction for ASA transfer
 */
async function createAssetTransferTransaction(senderAddress, recipientAddress, assetId, amount, note = '') {
  try {
    const params = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      senderAddress,
      recipientAddress,
      undefined, // closeRemainderTo
      undefined, // revocationTarget
      amount,
      note ? new TextEncoder().encode(note) : undefined,
      assetId,
      params
    );

    return {
      success: true,
      transaction: txn
    };
  } catch (error) {
    console.error('Create asset transfer transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create an unsigned transaction for ALGO transfer
 */
async function createAlgoTransferTransaction(senderAddress, recipientAddress, amount, note = '') {
  try {
    const params = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      senderAddress,
      recipientAddress,
      amount,
      undefined, // closeRemainderTo
      note ? new TextEncoder().encode(note) : undefined,
      params
    );

    return {
      success: true,
      transaction: txn
    };
  } catch (error) {
    console.error('Create ALGO transfer transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get account balance for specific asset
 */
async function getAccountBalance(address, assetId = 0) {
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
async function waitForConfirmation(txId, maxRounds = 10) {
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

module.exports = {
  algodClient,
  ASSETS,
  sendTransaction,
  getTransactionStatus,
  createAssetTransferTransaction,
  createAlgoTransferTransaction,
  getAccountBalance,
  waitForConfirmation
};
