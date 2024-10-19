import { RpcProvider, Account, CallData, stark } from 'starknet'
import { getCompiledCode } from './utils'

const rpcUrl = process.env.RPC_URL
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? ""
const deployerAddress = process.env.DEPLOYER_ADDRESS ?? ""

const provider = new RpcProvider({
    nodeUrl: rpcUrl 
});

const deployer = new Account(provider, deployerAddress, deployerPrivateKey);

console.log('Account connected successfully');

let sierraCode, casmCode;

try {
    ({ sierraCode, casmCode } = await getCompiledCode(
        "contracts_ERC721Collection"
    ));
} catch (error: any) {
    console.log("Failed to read contract files");
    process.exit(1)
}

console.log('Contract read successfully')

const myCallData = new CallData(sierraCode.abi);
const constructor = myCallData.compile("constructor", {
  owner: deployer.address,
  name: "Test tokens", 
  symbol: "TEST",
  base_uri: "ipfs:/test/tokens/",
});
const deployResponse = await deployer.declareAndDeploy({
  contract: sierraCode,
  casm: casmCode,
  constructorCalldata: constructor,
  salt: stark.randomAddress(),
});

console.log(
  `✅ Contract has been deployed with the address: ${deployResponse.deploy.address}`
);
