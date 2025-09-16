import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/api';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const History = () => {
  const { isAuthenticated, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
    hasMore: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated, filter]);

  const fetchTransactions = async (offset = 0) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        limit: pagination.limit,
        offset: offset,
        ...(filter !== 'all' && { status: filter })
      };

      const response = await transactionAPI.getHistory(params);
      
      if (response.success) {
        if (offset === 0) {
          setTransactions(response.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.transactions]);
        }
        
        setPagination({
          ...pagination,
          offset: offset,
          total: response.pagination.total,
          hasMore: response.pagination.hasMore
        });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && pagination.hasMore) {
      fetchTransactions(pagination.offset + pagination.limit);
    }
  };

  const refreshTransaction = async (txId) => {
    try {
      const response = await transactionAPI.updateStatus(txId);
      if (response.success) {
        // Update the transaction in the list
        setTransactions(prev => 
          prev.map(tx => 
            tx.txId === txId 
              ? { ...tx, ...response.transaction }
              : tx
          )
        );
      }
    } catch (error) {
      console.error('Failed to refresh transaction:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (!searchTerm) return true;
    return (
      tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipientAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.senderAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.assetSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600">Please connect your wallet to view transaction history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your cross-border remittance transactions</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2">
            {['all', 'pending', 'confirmed', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading && transactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No transactions match your search.' : 'You haven\'t made any transactions yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${tx.type === 'sent' ? 'bg-red-100' : 'bg-green-100'}`}>
                      {tx.type === 'sent' ? (
                        <ArrowUpIcon className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowDownIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {tx.type === 'sent' ? 'Sent to' : 'Received from'}
                        </span>
                        <span className="text-gray-600">
                          {formatAddress(tx.type === 'sent' ? tx.recipientAddress : tx.senderAddress)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(tx.initiatedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {tx.formattedAmount}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(tx.status)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div>
                    TX ID: <span className="font-mono">{tx.txId.slice(0, 16)}...</span>
                  </div>
                  {tx.status === 'pending' && (
                    <button
                      onClick={() => refreshTransaction(tx.txId)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Refresh Status
                    </button>
                  )}
                </div>
                
                {tx.note && (
                  <div className="mt-2 text-sm text-gray-600">
                    Note: {tx.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Load More Button */}
        {pagination.hasMore && !loading && (
          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
