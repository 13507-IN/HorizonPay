import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { activeAccount, isConnected } = useWallet();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have a valid token on mount
    if (token) {
      validateToken();
    }
  }, [token]);

  useEffect(() => {
    // Auto-login when wallet connects
    if (isConnected && activeAccount && !isAuthenticated) {
      loginWithWallet();
    }
  }, [isConnected, activeAccount, isAuthenticated]);

  const validateToken = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getProfile();
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async () => {
    try {
      setIsLoading(true);
      
      if (!activeAccount) {
        throw new Error('No active wallet account');
      }

      const response = await authAPI.walletLogin({
        walletAddress: activeAccount,
        signature: 'mock_signature' // In production, implement proper signature verification
      });

      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', response.token);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Wallet login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    loginWithWallet,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
