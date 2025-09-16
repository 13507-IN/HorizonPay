# MultiPay Fresh - Cross-Border Remittance dApp

A decentralized application for cross-border money transfers using stablecoins on the Algorand blockchain.

## 🌟 Features

- **Wallet Integration**: Connect with Pera Wallet or WalletConnect
- **Multi-Currency Support**: ALGO, USDC, EURC, BRZ transfers
- **Instant Settlement**: Transactions settle in <5 seconds on Algorand
- **Transaction History**: Complete history with blockchain verification
- **Real-time Exchange Rates**: Live FX rates for currency conversion
- **User Profiles**: Optional KYC and profile management
- **Responsive UI**: Modern, mobile-friendly interface

## 🏗️ Architecture

### Frontend (React + Vite + TailwindCSS)
- **Components**: Navbar, transaction forms, history views
- **Contexts**: Wallet and authentication management
- **Services**: API integration and Algorand blockchain interaction
- **Pages**: Home, Send, History, Profile

### Backend (Node.js + Express + MongoDB)
- **Models**: User and Transaction schemas
- **Routes**: Auth, transactions, rates, users
- **Services**: Algorand blockchain integration
- **Middleware**: JWT authentication

### Blockchain Integration
- **Algorand SDK**: For ASA transfers and transaction management
- **Testnet Configuration**: Safe testing environment
- **Multi-Asset Support**: Native ALGO and stablecoin transfers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Pera Wallet browser extension

### Installation

1. **Clone and setup the project**:
   ```bash
   cd MultiPayFresh
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will run on http://localhost:5000

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:5173

### Environment Configuration

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/multipay-fresh
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
USDC_ASSET_ID=10458941
EURC_ASSET_ID=227855942
BRZ_ASSET_ID=227855943
PORT=5000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_PORT=443
VITE_USDC_ASSET_ID=10458941
VITE_EURC_ASSET_ID=227855942
VITE_BRZ_ASSET_ID=227855943
```

## 📱 Usage

### 1. Connect Wallet
- Install Pera Wallet browser extension
- Click "Connect Wallet" in the app
- Approve the connection in Pera Wallet

### 2. Send Remittance
- Navigate to the "Send" page
- Enter recipient's Algorand address
- Select currency (ALGO, USDC, EURC, BRZ)
- Enter amount and optional note
- Sign and submit the transaction

### 3. View History
- Check the "History" page for all transactions
- Filter by status (pending, confirmed, failed)
- Search by transaction ID or addresses
- Refresh pending transactions for updates

### 4. Manage Profile
- Update personal information
- Set preferred currency
- View account statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/wallet-login` - Login with wallet
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Transactions
- `POST /api/transactions/send` - Send transaction
- `GET /api/transactions/history` - Get transaction history
- `GET /api/transactions/:txId` - Get transaction details
- `PUT /api/transactions/:txId/status` - Update transaction status

### Exchange Rates
- `GET /api/rates` - Get current exchange rates
- `POST /api/rates/convert` - Convert between currencies

### Users
- `GET /api/users/stats` - Get user statistics

## 🧪 Testing

### Testnet Setup
1. Get testnet ALGO from the [Algorand Dispenser](https://testnet.algoexplorer.io/dispenser)
2. Add testnet assets to your wallet:
   - USDC: Asset ID 10458941
   - EURC: Asset ID 227855942
   - BRZ: Asset ID 227855943

### Test Transaction Flow
1. Connect wallet with testnet account
2. Ensure you have testnet ALGO for fees
3. Add desired testnet stablecoins to your wallet
4. Send a small test transaction
5. Verify transaction appears in history

## 🔐 Security Features

- **JWT Authentication**: Secure API access
- **Wallet Signature Verification**: Cryptographic authentication
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API protection against abuse
- **Environment Variables**: Secure configuration management

## 🌐 Supported Networks

- **Algorand Testnet**: For development and testing
- **Algorand Mainnet**: Production-ready (update environment variables)

## 📊 Supported Assets

| Asset | Symbol | Testnet ID | Mainnet ID |
|-------|--------|------------|------------|
| Algorand | ALGO | 0 | 0 |
| USD Coin | USDC | 10458941 | 31566704 |
| Euro Coin | EURC | 227855942 | 227855942 |
| Brazilian Digital Token | BRZ | 227855943 | 227855943 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the GitHub issues
2. Review the documentation
3. Test on Algorand testnet first
4. Ensure all environment variables are set correctly

---

**Built with ❤️ using Algorand blockchain technology**
