const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get transaction count from Transaction model
    const Transaction = require('../models/Transaction');
    const transactionCount = await Transaction.countDocuments({
      $or: [
        { senderAddress: user.walletAddress },
        { recipientAddress: user.walletAddress }
      ]
    });

    res.json({
      success: true,
      stats: {
        totalTransactions: transactionCount,
        kycStatus: user.kycStatus,
        memberSince: user.createdAt,
        lastLogin: user.lastLoginAt,
        preferredCurrency: user.preferredCurrency
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
