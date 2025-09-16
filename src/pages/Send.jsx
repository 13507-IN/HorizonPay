import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI, ratesAPI } from '../services/api';
import { createAssetTransferTransaction, createAlgoTransferTransaction, ASSETS } from '../services/algorand';
import { 
  PaperAirplaneIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Send = () => {
  const { isConnected, activeAccount, signTransaction } = useWallet();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    recipientAddress: '',
    currency: 'USDC',
    amount: '',
    note: ''
  });
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [estimatedFee, setEstimatedFee] = useState(0.001);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await ratesAPI.getRates();
      if (response.success) {
        setRates(response.rates);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.recipientAddress) {
      setError('Recipient address is required');
      return false;
    }
    
    if (formData.recipientAddress.length !== 58) {
      setError('Invalid Algorand address format');
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (formData.recipientAddress === activeAccount) {
      setError('Cannot send to your own address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected || !isAuthenticated) {
      setError('Please connect your wallet and login first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate wallet connection and active account
      if (!isConnected || !activeAccount) {
        throw new Error('Please connect your wallet first');
      }

      // Validate form data
      if (!formData.recipientAddress) {
        throw new Error('Please enter a recipient address');
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      console.log('Transaction params:', {
        activeAccount,
        recipientAddress: formData.recipientAddress,
        currency: formData.currency,
        amount: formData.amount
      });

      const amount = parseFloat(formData.amount);
      const assetInfo = ASSETS[formData.currency];
      
      const amountInBaseUnits = Math.floor(amount * Math.pow(10, assetInfo.decimals));

      let txnResult;
      if (formData.currency === 'ALGO') {
        txnResult = await createAlgoTransferTransaction(
          activeAccount,
          formData.recipientAddress,
          amountInBaseUnits,
          formData.note
        );
      } else {
        txnResult = await createAssetTransferTransaction(
          activeAccount,
          formData.recipientAddress,
          assetInfo.id,
          amountInBaseUnits,
          formData.note
        );
      }

      if (!txnResult.success) {
        throw new Error(txnResult.error);
      }

      const signedTxn = await signTransaction(txnResult.transaction);
      
      const response = await transactionAPI.send({
        recipientAddress: formData.recipientAddress,
        assetId: assetInfo.id,
        assetSymbol: formData.currency,
        amount: amount,
        note: formData.note,
        signedTxn: Buffer.from(signedTxn[0]).toString('base64')
      });

      if (response.success) {
        setSuccess(`Transaction submitted successfully! TX ID: ${response.transaction.txId}`);
        setFormData({
          recipientAddress: '',
          currency: 'USDC',
          amount: '',
          note: ''
        });
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Send transaction error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        fullError: error
      });
      setError(error.message || 'Failed to send transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const getUSDValue = () => {
    if (!rates || !formData.amount) return null;
    const rate = rates[formData.currency]?.USD;
    if (rate) {
      return (parseFloat(formData.amount) * rate).toFixed(2);
    }
    return null;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-primary py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text-blue mb-4">Send Remittance</h1>
            <p className="text-lg text-gray-300">Send money globally using stablecoins on Algorand</p>
          </div>
          <div className="glass rounded-2xl p-8 card-hover">
            <div className="text-center">
              <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h2>
              <p className="text-gray-600 mb-6">Please connect your Pera Wallet to send transactions.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text-blue mb-4">Send Remittance</h1>
          <p className="text-lg text-gray-300">Send money globally using stablecoins on Algorand</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Address */}
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-black-800 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipientAddress"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                placeholder="Enter Algorand wallet address (58 characters)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Currency Selection */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-black-800 mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALGO">ALGO - Algorand</option>
                <option value="USDC">USDC - USD Coin</option>
                <option value="EURC">EURC - Euro Coin</option>
                <option value="BRZ">BRZ - Brazilian Digital Token</option>
                <option value="INR">INR - Indian Rupee Token</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.000001"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  className="input-dark w-full pr-16"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">{formData.currency}</span>
                </div>
              </div>
              {getUSDValue() && (
                <p className="text-sm text-blue-600 mt-1">
                  ≈ ${getUSDValue()} USD
                </p>
              )}
            </div>

            {/* Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Note (Optional)
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Add a note for this transaction"
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Transaction Summary */}
            {formData.amount && rates && (
              <div className="bg-dark-card rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Transaction Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-medium text-white">{formData.amount} {formData.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">USD Value:</span>
                    <span className="font-medium text-white">
                      ${getUSDValue()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network Fee:</span>
                    <span className="font-medium text-white">{estimatedFee} ALGO</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 flex justify-between">
                    <span className="font-semibold text-white">Total Cost:</span>
                    <span className="font-semibold text-white">
                      {formData.amount} {formData.currency} + {estimatedFee} ALGO
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isConnected || !isAuthenticated}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send Transaction</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Send;
