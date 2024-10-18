import React from "react";
import { Link } from "react-router-dom";
import WalletConnector from "./WalletConnector";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
                <Link
                  to="/create"
                  className="text-gray-600 hover:text-gray-800"
                >
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

      {/* Main Content */}
      <main>{children}</main>

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

export default Layout;
