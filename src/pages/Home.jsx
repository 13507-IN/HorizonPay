import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { ratesAPI, usersAPI } from '../services/api';
import { 
  PaperAirplaneIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BoltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const [rates, setRates] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRates();
    if (isAuthenticated) {
      fetchUserStats();
    }
  }, [isAuthenticated]);

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

  const fetchUserStats = async () => {
    try {
      const response = await usersAPI.getStats();
      if (response.success) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const features = [
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Send money anywhere in the world instantly using Algorand blockchain'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Transparent',
      description: 'All transactions are secured by blockchain technology and fully transparent'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Multi-Currency',
      description: 'Support for USDC, EURC, BRZ and other stablecoins'
    },
    {
      icon: ChartBarIcon,
      title: 'Low Fees',
      description: 'Minimal transaction fees compared to traditional remittance services'
    }
  ];

  const supportedCurrencies = [
    { symbol: 'ALGO', name: 'Algorand', color: 'bg-blue-500' },
    { symbol: 'USDC', name: 'USD Coin', color: 'bg-green-500' },
    { symbol: 'EURC', name: 'Euro Coin', color: 'bg-purple-500' },
    { symbol: 'BRZ', name: 'Brazilian Digital Token', color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full opacity-80 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-300 rounded-full opacity-50 animate-pulse-slow" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 space-y-20 py-16 px-4 max-w-full mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full text-sm font-medium text-white animate-bounce-in hover-scale cursor-pointer">
            <SparklesIcon className="w-5 h-5 text-yellow-300" />
            <span>Powered by Algorand Blockchain</span>
            <BoltIcon className="w-5 h-5 text-yellow-300" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold gradient-text-blue leading-tight animate-slide-in">
            Cross-Border Remittance
            <span className="block gradient-text-green">Made Simple</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
            Send money globally in <span className="font-semibold text-blue-400">seconds</span> using stablecoins on the Algorand blockchain. 
            <br className="hidden md:block" />
            Fast, secure, and transparent cross-border payments.
          </p>
          
          {!isConnected ? (
            <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-gradient text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3 inline-block" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-6 h-6 mr-3 inline-block" />
                    Connect Wallet to Get Started
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400">Supports Pera Wallet & WalletConnect</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Link 
                to="/send" 
                className="btn-gradient-green text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-xl hover-lift flex items-center space-x-3"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
                <span>Send Money</span>
              </Link>
              <Link 
                to="/history" 
                className="glass text-white border-2 border-white/20 hover:border-white/40 px-10 py-6 text-lg font-semibold rounded-2xl shadow-lg hover-lift flex items-center space-x-3 transition-all duration-300"
              >
                <ClockIcon className="w-6 h-6" />
                <span>View History</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Stats */}
        {isAuthenticated && userStats && (
          <div className="glass rounded-3xl p-8 card-hover animate-slide-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text-blue mb-2">Your Account</h2>
              <p className="text-lg text-gray-300">Your remittance activity overview</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group cursor-pointer hover-scale">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:rotate-12 animate-float">
                  <span className="text-2xl font-bold">{userStats.totalTransactions}</span>
                </div>
                <div className="text-gray-300 font-medium">Total Transactions</div>
              </div>
              <div className="text-center group cursor-pointer hover-scale">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-green-500/50 transition-all duration-300 transform group-hover:rotate-12 animate-float" style={{animationDelay: '1s'}}>
                  <span className="text-lg font-bold">{userStats.preferredCurrency}</span>
                </div>
                <div className="text-gray-300 font-medium">Preferred Currency</div>
              </div>
              <div className="text-center group cursor-pointer hover-scale">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl transition-all duration-300 transform group-hover:rotate-12 animate-float ${
                  userStats.kycStatus === 'verified' 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white group-hover:shadow-green-500/50' 
                    : 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white group-hover:shadow-yellow-500/50'
                }`} style={{animationDelay: '2s'}}>
                  <CheckCircleIcon className="w-10 h-10" />
                </div>
                <div className="text-gray-300 font-medium">
                  {userStats.kycStatus === 'verified' ? 'Verified' : 'Pending'} KYC
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Rates */}
        {rates && (
          <div className="glass rounded-3xl p-8 card-hover animate-slide-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text-purple flex items-center justify-center space-x-3 mb-2">
                <CurrencyDollarIcon className="w-8 h-8 text-purple-400" />
                <span>Live Exchange Rates</span>
              </h2>
              <p className="text-lg text-gray-300">Real-time rates updated every minute</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(rates).map(([currency, rateData], index) => (
                <div 
                  key={currency} 
                  className="text-center p-6 glass rounded-2xl hover-scale cursor-pointer animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="text-2xl font-bold text-white mb-2 animate-pulse-slow">
                    {currency.toUpperCase()}
                  </div>
                  <div className="text-lg text-gray-300 mb-2">
                    ${typeof rateData === 'object' && rateData.USD ? rateData.USD.toFixed(4) : 'N/A'}
                  </div>
                  {typeof rateData === 'object' && rateData.change24h !== undefined && (
                    <div className={`text-sm font-medium ${
                      rateData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {rateData.change24h >= 0 ? '↗' : '↘'} {rateData.change24h >= 0 ? '+' : ''}{rateData.change24h.toFixed(2)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supported Currencies */}
        <div className="glass rounded-3xl p-8 card-hover animate-slide-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text-green flex items-center justify-center space-x-3 mb-2">
              <GlobeAltIcon className="w-8 h-8 text-green-400" />
              <span>Supported Currencies</span>
            </h2>
            <p className="text-lg text-gray-300">Send money using these stablecoins</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {supportedCurrencies.map((currency, index) => (
              <div 
                key={index} 
                className="text-center p-6 glass rounded-2xl hover-scale cursor-pointer animate-fade-in"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl transition-all duration-500 transform hover:rotate-12 animate-float ${currency.color}`}
                     style={{animationDelay: `${index * 0.3}s`}}>
                  <span className="text-white font-bold text-xl">{currency.symbol.slice(0, 2)}</span>
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {currency.symbol}
                </div>
                <div className="text-sm text-gray-300">
                  {currency.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="glass rounded-3xl p-8 card-hover animate-slide-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text-green mb-4">
              Why Choose MultiPay Fresh?
            </h2>
            <p className="text-xl text-gray-300">
              Experience the future of cross-border payments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-6 glass rounded-2xl hover-scale cursor-pointer animate-fade-in" 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl transition-all duration-500 transform hover:rotate-12 animate-float bg-gradient-to-br from-blue-500 to-blue-600">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:gradient-text-blue">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        {!isConnected && (
          <div className="glass rounded-3xl p-12 text-center card-hover animate-slide-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold mb-6 gradient-text-blue">
                Ready to Start Sending?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Connect your Pera Wallet to start sending cross-border remittances instantly.
                Join thousands of users already using our platform.
              </p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3 inline-block" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <BoltIcon className="w-6 h-6 mr-3 inline-block" />
                    Connect Wallet Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
