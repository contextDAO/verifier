import { JsonRpcProvider, Contract } from "ethers";
import abiRegistry from './src/contracts/ContextRegistry.json';
import abiDocument from './src/contracts/ContextDocument.json';
import { getMajorMinorPatchFromId } from "./src/versions";

import * as dotenv from "dotenv";
import readData from "./src/readData";
dotenv.config();

const network = 'mainnet';
const registryAddr = '0x2B2b6ECe0b5D67Dd00e8A6cA7B3840929eb176F6';

const main = async (level1: string, level2: string) => {
  const name = level1 === level2 ? level1 : `${level1}/${level2}`;
  console.error(`Name: ${name}`);

  // Check the provider
  const providerUrl = process.env.POLYGON_PROVIDER;
  if (!providerUrl) {
    console.error('Please, set the provider into the .env file');
    console.warn('Example: POLYGON_PROVIDER=https://polygon-mainnet.g.alchemy.com/v2/aaabbbccc')
    return;
  }
  const provider = new JsonRpcProvider(providerUrl);
  
  // Init registry
  let ctxRegistry: Contract;
  try {
    ctxRegistry = new Contract(registryAddr, abiRegistry.abi, provider);
  } catch (error) {
    console.error(`Error getting contract. ${error.message}`);
    return;
  }

  // Read level1
  console.log(``);
  console.log(`GETTING DATA FROM THE REGISTRY (POLYGON)`);
  let document: any[];
  try {
    document = await ctxRegistry.read(level1);
  } catch (error) {
    console.error(`Name ${level1} is not registered`);
    return;
  }
  // Set owner and document address
  const owner = document[0];
  const documentAddress = document[1];
  console.log(`  > Owner: ${owner}`);
  console.log(`  > Document adddress: ${documentAddress}`);

  // Getting data from the document
  console.log(``);
  console.log(`GETTING DATA FROM THE DOCUMENT (POLYGON)`);
  const ctxDocument = new Contract(documentAddress, abiDocument.abi, provider);
  const info = await ctxDocument.read(level2);
  const vId = info[0] as bigint;
  const major = info[1];
  const minor = info[2];
  const patch = info[3];
  console.log(`  > Major: ${major}`);
  console.log(`  > Minor: ${minor}`);
  console.log(`  > Patch: ${patch}`);
  if (!major) {
    console.error(`Name ${name} does not exist or is not pushed yet`);
    return;
  }
  const version = getMajorMinorPatchFromId(vId);

  const fullName = `${name}#${version.major}.${version.minor}.${version.patch}`; 
  console.log(`  > Full name: ${fullName}`);

  // Get read data from blockchain
  console.log(``);
  console.log(`GETTING DATA FROM ARWEAVE`);
  console.log(``);
  const prevTxId = patch;
  const result = await readData(network, prevTxId);

  // Get read data from blockchain
  console.log(``);
  console.log(`BUILDING DATA FROM THE ARWEAVE TxIds`);
  console.log(`  > Name: ${fullName}`);
  console.log(`  > Data:`);
  console.log(result.data);  
};


// Check params
const args = process.argv;
if (args.length <= 2) {
  console.error('Please, set the handle or name which you want to verify');
  console.warn('Command: npx ts-node start.ts {name}');
  console.log('Example: npx ts-node start.ts context');
  process.exit(1);
}

const name = args[2];
const namePieces = name.split('/');
const level1 = namePieces[0];
let level2 = level1;
if (!!namePieces[1]) level2 = namePieces[1];

main(level1, level2);