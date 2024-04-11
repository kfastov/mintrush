// src/components/CreateCollectionPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Images from './Images';
import MainnetStub from './MainnetStub';
import Layout from './Layout';
import * as Delegation from '@ucanto/core/delegation';
import * as Client from '@web3-storage/w3up-client';
import { CarWriter } from '@ipld/car';
import { CID, Link as CIDLink, Version } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import * as raw from 'multiformats/codecs/raw';
import { createDirectoryEncoderStream, CAREncoderStream } from 'ipfs-car'

/** Root CID written in CAR file header before it is updated with the real root CID. */
const placeholderCID = CID.parse('bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi')

const initClient = async () => {
  // Create a new client
  const client = await Client.create();

  // Fetch the delegation from the backend
  // const apiUrl = `/api/w3up-delegation/${client.agent().did()}`
  const apiUrl = `https://mintrush-backend.fly.dev/test`;
  const response = await fetch(apiUrl, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ did: client.agent.did() }),
  });
  const data = await response.json();
  const bytes = Uint8ArrayFromBase64(data.delegation);

  // Deserialize the delegation
  const delegation = await Delegation.extract(bytes);
  if (!delegation.ok) {
    throw new Error("Failed to extract delegation", {
      cause: delegation.error,
    });
  }

  // Add proof that this agent has been delegated capabilities on the space
  const space = await client.addSpace(delegation.ok);
  client.setCurrentSpace(space.did());

  // READY to go!
  return client;
};

const metadataConstructor = (description: string, imagesCid: string, files: File[]) => {
  const metadatas = files.map((file) => ({
    name: file.name,
    description: description,
    image: `ipfs://${imagesCid}/${file.name}`,
  }));
  return metadatas;
};

function Uint8ArrayFromBase64(base64String: string): Uint8Array {
  // Decode the Base64 string to a binary string
  const binaryString = atob(base64String);

  // Convert the binary string to a Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

// TODO pack to car and then use that CAR in the uploadFiles function
const calculateCid = async (files: File[]) => {
  let rootCID: CIDLink<unknown, number, number, Version> | undefined

  await createDirectoryEncoderStream(files)
    .pipeThrough(new TransformStream({
      transform (block, controller) {
        rootCID = block.cid
        controller.enqueue(block)
      }
    }))
    .pipeThrough(new CAREncoderStream())
    .pipeTo(new WritableStream())

  // todo don't return undefined
  return rootCID?.toString()
};

const CreateCollectionPage = () => {
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [mintPrice, setMintPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [client, setClient] = useState<Client.Client | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      const client = await initClient();
      setClient(client);
    };

    initializeClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Calculating CIDs...');
    const imagesCid = await calculateCid(files);
    console.log('imagesCid', imagesCid);

    setStatus("Uploading files...");
    if (!client) {
      console.error("Error: client is not initialized");
      setStatus("Error initializing client. Please refresh the page and try again.");
      setIsLoading(false);
      return;
    }

    try {
      const directoryCid = await client.uploadDirectory(files);
      // // create metadata JSONs
      // const metadatas = metadataConstructor(
      //   "description",
      //   directoryCid.toString(),
      //   files,
      // );
      // upload metadata JSONs to separate directory
      // const metadataCid = await client.uploadDirectory(metadatas);
      console.log('Uploaded directory CID:', directoryCid.toString());
    } catch (e) {
      console.error('Error uploading files:', e);
      setStatus("Error uploading files. Please try again.");
      setIsLoading(false);
      return;
    }


    try {
      // Upload files
      const uploadedFiles = await uploadFiles(files);

      setStatus("Deploying collection to the blockchain...");
      // TODO: Implement the logic to deploy the collection to the blockchain
      // You can use the collectionName, collectionSymbol, mintPrice, and files state variables
      // to create the collection and deploy it to the blockchain
      console.log("Deploying collection to the blockchain...");

      setStatus("Collection deployed successfully!");
    } catch (error) {
      console.error("Error deploying collection:", error);
      setStatus("Error deploying collection. Please try again.");
    }

    setIsLoading(false);
  };

  const uploadFiles = async (files: File[]) => {
    // TODO: Implement the logic to upload files to a storage service (e.g., IPFS, AWS S3)
    // You can use the same upload logic from the Images component or adapt it to your needs
    console.log("Uploading files...");
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
              <label
                htmlFor="collectionName"
                className="block mb-2 font-bold text-gray-700"
              >
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
              <label
                htmlFor="collectionSymbol"
                className="block mb-2 font-bold text-gray-700"
              >
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
              <label
                htmlFor="mintPrice"
                className="block mb-2 font-bold text-gray-700"
              >
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
              <label className="block mb-2 font-bold text-gray-700">
                Upload Files
              </label>
              <Images files={files} setFiles={setFiles} />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Collection..." : "Create Collection"}
            </button>
            {status && <p className="mt-4 text-gray-600">{status}</p>}
          </form>
        </section>
      </MainnetStub>
    </Layout>
  );
};

export default CreateCollectionPage;
