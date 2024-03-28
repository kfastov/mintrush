import React from 'react';
import { Link } from 'react-router-dom';
import ConnectModal from './starknet/ConnectModal';
import WalletConnector from './WalletConnector';
import { useNetwork } from '@starknet-react/core';

const HomePage = () => {
  const network = useNetwork();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">NFT Creator</div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-800">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-600 hover:text-gray-800">
                  Create
                </Link>
              </li>
              <li>
              <WalletConnector />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow hero bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Create Your Own NFT Collection
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Easily create and deploy your NFT collection with our no-code tool.
          </p>
          <Link
            to="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-gray-600">
            &copy; 2023 NFT Creator. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;