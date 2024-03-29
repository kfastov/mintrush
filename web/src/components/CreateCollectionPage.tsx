// src/components/CreateCollectionPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Images from './Images';
import MainnetStub from './MainnetStub';
import Layout from './Layout';

const CreateCollectionPage = () => {
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');
  const [mintPrice, setMintPrice] = useState('');
  const [files, setFiles] = useState([] as File[]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Uploading files...');
    try {
      // Upload files
      const uploadedFiles = await uploadFiles(files);

      setStatus('Deploying collection to the blockchain...');
      // TODO: Implement the logic to deploy the collection to the blockchain
      // You can use the collectionName, collectionSymbol, mintPrice, and files state variables
      // to create the collection and deploy it to the blockchain
      console.log('Deploying collection to the blockchain...');

      setStatus('Collection deployed successfully!');
    } catch (error) {
      console.error('Error deploying collection:', error);
      setStatus('Error deploying collection. Please try again.');
    }

    setIsLoading(false);
  };

  const uploadFiles = async (files: File[]) => {
    // TODO: Implement the logic to upload files to a storage service (e.g., IPFS, AWS S3)
    // You can use the same upload logic from the Images component or adapt it to your needs
    console.log('Uploading files...');
    // Return the uploaded file URLs or metadata
    return files.map((file) => `https://example.com/${file.name}`);
  };

  return (
    <Layout>
      <MainnetStub>
        <section className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Create Collection</h1>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-6">
              <label htmlFor="collectionName" className="block mb-2 font-bold text-gray-700">
                Collection Name
              </label>
              <input
                type="text"
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="collectionSymbol" className="block mb-2 font-bold text-gray-700">
                Collection Symbol
              </label>
              <input
                type="text"
                id="collectionSymbol"
                value={collectionSymbol}
                onChange={(e) => setCollectionSymbol(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="mintPrice" className="block mb-2 font-bold text-gray-700">
                Mint Price
              </label>
              <input
                type="text"
                id="mintPrice"
                value={mintPrice}
                onChange={(e) => setMintPrice(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-bold text-gray-700">Upload Files</label>
              <Images files={files} setFiles={setFiles} />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Collection...' : 'Create Collection'}
            </button>
            {status && <p className="mt-4 text-gray-600">{status}</p>}
          </form>
        </section>
      </MainnetStub>
    </Layout>
  );
};

export default CreateCollectionPage;