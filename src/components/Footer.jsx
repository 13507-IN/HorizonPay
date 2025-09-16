import React from 'react';
import { 
  HeartIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-secondary border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text-blue">MultiPayFresh</h3>
            </div>
            <p className="text-gray-600 mb-6">Please connect your Lute Wallet to send transactions.</p>
            <p className="text-gray-300 mb-4 max-w-md">
              Revolutionizing cross-border remittances with blockchain technology. 
              Send money globally with instant settlement, low fees, and complete transparency.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Secured by Algorand</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <GlobeAltIcon className="w-4 h-4" />
                <span>Global Coverage</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/send" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Send Money
                </a>
              </li>
              <li>
                <a href="/history" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Transaction History
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Profile
                </a>
              </li>
              <li>
                <a href="/rates" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Exchange Rates
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>&copy; {currentYear} MultiPayFresh. All rights reserved.</span>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">Made with</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-400">on Algorand</span>
          </div>
        </div>

        {/* Network Status */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300">Algorand Network: Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
