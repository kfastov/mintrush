// Partially taken from https://github.com/Scaffold-Stark/scaffold-stark-2
import path from 'path';
import { formatUnits } from 'ethers';

// Define an interface for the response data
interface MintResponse {
  new_balance: string;
  unit: string;
  tx_hash: string;
}

// Manually parse the arguments
const inputAddress = process.argv[2]; // Access the first positional argument
const eth = process.argv[3] ? parseFloat(process.argv[3]) : 1000; // Access the second positional argument or default

// Validate the input
if (!inputAddress) {
  console.log(`Usage: ${path.basename(process.argv[1])} <address> [amount]`); // Display usage
  console.error('You must provide at least the address');
  process.exit(1);
}

try {
  const response = await fetch("http://0.0.0.0:5050/mint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: inputAddress,
      amount: eth * 10 ** 18,
      unit: "WEI",
    }),
  });
  if (!response.ok) {
    throw new Error(`${response.statusText}`);
  }
  const data: MintResponse = await response.json();
  const newBalance = formatUnits(BigInt(data.new_balance), 18);
  console.log(`✅ Successfully minted ${eth} ETH to ${inputAddress}. New balance: ${newBalance} ETH 🚀`);
} catch (error) {
  console.error("There was a problem with the operation", error);
}
