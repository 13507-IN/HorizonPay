import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { 
  UserIcon, 
  WalletIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { isAuthenticated, user, updateProfile, isLoading } = useAuth();
  const { activeAccount } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    country: user?.country || '',
    phoneNumber: user?.phoneNumber || '',
    preferredCurrency: user?.preferredCurrency || 'USDC'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      country: user?.country || '',
      phoneNumber: user?.phoneNumber || '',
      preferredCurrency: user?.preferredCurrency || 'USDC'
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pending':
      case 'rejected':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <UserIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Wallet Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <WalletIcon className="w-6 h-6" />
          <span>Wallet Information</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm break-all">
              {activeAccount}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KYC Status
            </label>
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getKycStatusColor(user?.kycStatus)}`}>
              {getKycStatusIcon(user?.kycStatus)}
              <span className="font-medium capitalize">
                {user?.kycStatus?.replace('_', ' ') || 'Not Started'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <UserIcon className="w-6 h-6" />
            <span>Personal Information</span>
          </h2>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label htmlFor="preferredCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Currency
              </label>
              <select
                id="preferredCurrency"
                name="preferredCurrency"
                value={formData.preferredCurrency}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="ALGO">ALGO - Algorand</option>
                <option value="USDC">USDC - USD Coin</option>
                <option value="EURC">EURC - Euro Coin</option>
                <option value="BRZ">BRZ - Brazilian Digital Token</option>
              </select>
            </div>
          </div>

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

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-gray-600">Member Since</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-gray-600">Last Login</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${user?.kycStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>
              {user?.kycStatus === 'verified' ? 'Verified' : 'Pending'}
            </div>
            <div className="text-gray-600">Verification Status</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
