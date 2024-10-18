import React, { Children } from "react";
import { Link } from "react-router-dom";
import { useNetwork } from "@starknet-react/core";

interface MainnetStubProps {
  children: React.ReactNode;
}

const MainnetStub = (props: MainnetStubProps) => {
  const network = useNetwork();

  return (
    <>
      {!network.chain.testnet ? (
        <section className="flex-grow hero bg-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Sorry</h1>
            <p className="text-xl text-gray-600 mb-8">
              The NFT Creator is only available on the Starknet testnet. Please
              switch to the testnet to use the NFT Creator.
            </p>
            {/* TODO real link */}
            <Link
              to="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
            >
              Switch to Testnet
            </Link>
          </div>
        </section>
      ) : (
        props.children
      )}
    </>
  );
};

export default MainnetStub;
