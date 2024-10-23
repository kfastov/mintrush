import fs from 'fs'
import { RpcProvider, Account, stark, shortString, type CompiledSierra, type CompiledSierraCasm } from 'starknet'
import { getCompiledCode } from './utils'

const rpcUrl = process.env.RPC_URL
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? ""
const deployerAddress = process.env.DEPLOYER_ADDRESS ?? ""

const provider = new RpcProvider({
    nodeUrl: rpcUrl 
});

const deployer = new Account(provider, deployerAddress, deployerPrivateKey);

console.log('Account connected successfully');

interface CompiledCode {
    sierraCode: CompiledSierra;
    casmCode: CompiledSierraCasm;
}

let collectionCode, factoryCode: CompiledCode;

try {
    collectionCode = await getCompiledCode(
        "contracts_ERC721Collection"
    );
    factoryCode = await getCompiledCode(
        "contracts_CollectionFactory"
    );
} catch (error: any) {
    console.log("Failed to read contract files");
    process.exit(1)
}

console.log('Contract read successfully')


// declare the collection contract because it will be deployed only by factory contract
const declareResponse = await deployer.declareIfNot({
  contract: collectionCode.sierraCode,
  casm: collectionCode.casmCode,
});

console.log(`✅ Collection contract has been declared with the class hash: ${declareResponse.class_hash}`);

const deployResponse = await deployer.declareAndDeploy({
  contract: factoryCode.sierraCode,
  casm: factoryCode.casmCode,
  constructorCalldata: [],
  salt: stark.randomAddress(),
  unique: false
});

console.log(
  `✅ Factory contract has been deployed with the address: ${deployResponse.deploy.address}`
);

// write the factory address and class hash to deployments file
const chainName = await getChainName();

// make deployments dir if not exists
fs.mkdirSync(`deployments`, { recursive: true });

const deploymentsPath = `deployments/${chainName}.json`

fs.writeFileSync(deploymentsPath, JSON.stringify({
  factoryAddress: deployResponse.deploy.address,
  collectionClassHash: declareResponse.class_hash
}, null, 2));

async function getChainName() {
  const chainId = await provider.getChainId();
  const pretendedName = shortString.decodeShortString(chainId);
  if (pretendedName === 'SN_SEPOLIA') {
    if (rpcUrl?.includes('127.0.0.1') || rpcUrl?.includes('localhost')) {
      return 'devnet'
    }
    return 'sepolia'
  }
  return pretendedName.replace('SN_', '').toLowerCase()
}