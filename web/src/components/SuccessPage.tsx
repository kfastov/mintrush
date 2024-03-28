import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const SuccessPage = () => {
  return (
    <Layout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Created Successfully!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your NFT collection has been successfully deployed to the blockchain.
        </p>
        <div className="mb-8">
          <p className="text-lg text-gray-700">
            Transaction Hash: <span className="font-bold">0x1234567890abcdef</span>
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View on Blockchain Explorer
          </a>
        </div>
        <Link
          to="/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
        >
          Create Another Collection
        </Link>
      </section>
    </Layout>
  );
};

export default SuccessPage;