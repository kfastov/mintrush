import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const HomePage = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default HomePage;