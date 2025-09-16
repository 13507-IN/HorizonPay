import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  PaperAirplaneIcon, 
  ClockIcon, 
  UserIcon,
  WalletIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const { isConnected, connectWallet, disconnectWallet, isConnecting, activeAccount } = useWallet();
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Send', href: '/send', icon: PaperAirplaneIcon },
    { name: 'History', href: '/history', icon: ClockIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const handleWalletAction = async () => {
    if (isConnected) {
      disconnectWallet();
      logout();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="glass backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 transition-all duration-300 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover-scale transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:rotate-12">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold gradient-text-blue leading-tight">MultiPay</span>
                <span className="text-sm text-gray-400 font-medium -mt-1">Fresh</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-scale relative overflow-hidden ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg shadow-blue-500/25 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-lg hover:shadow-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-medium">Welcome, {user.displayName}</span>
              </div>
            )}
            
            <button
              onClick={handleWalletAction}
              disabled={isConnecting}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-scale relative overflow-hidden ${
                isConnected
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/50 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
                  : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg hover:shadow-purple-500/50 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isConnected ? (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span className="hidden sm:inline font-mono text-xs bg-black/20 px-2 py-1 rounded">{formatAddress(activeAccount)}</span>
                  <ArrowRightOnRectangleIcon className="w-4 h-4 sm:hidden" />
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5" />
                  <span className="font-semibold">Connect Wallet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="px-4 pt-4 pb-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 hover-scale relative overflow-hidden ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 shadow-lg shadow-blue-500/25'
                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
