import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Send from './pages/Send';
import History from './pages/History';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark-primary flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/send" element={<Send />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </WalletProvider>
  );
}

export default App;
