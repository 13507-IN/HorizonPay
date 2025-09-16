import React, { createContext, useContext, useState, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [peraWallet] = useState(new PeraWalletConnect());
  const [accounts, setAccounts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Reconnect to session if it exists
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length > 0) {
        setAccounts(accounts);
        setIsConnected(true);
      }
    }).catch((error) => {
      console.log('No existing session found');
    });

    // Listen for disconnect events
    peraWallet.connector?.on('disconnect', handleDisconnect);

    return () => {
      peraWallet.connector?.off('disconnect', handleDisconnect);
    };
  }, [peraWallet]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const newAccounts = await peraWallet.connect();
      setAccounts(newAccounts);
      setIsConnected(true);
      return newAccounts;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect();
    handleDisconnect();
  };

  const handleDisconnect = () => {
    setAccounts([]);
    setIsConnected(false);
  };

  const signTransaction = async (txn) => {
    try {
      if (!isConnected || accounts.length === 0) {
        throw new Error('Wallet not connected');
      }

      const signedTxn = await peraWallet.signTransaction([txn]);
      return signedTxn;
    } catch (error) {
      console.error('Transaction signing failed:', error);
      throw error;
    }
  };

  const value = {
    peraWallet,
    accounts,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    signTransaction,
    activeAccount: accounts[0] || null
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
