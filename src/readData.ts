// Shared Lib
import { Response, ResponseStatus } from './types/types';
import { aplyPatches }  from './jsonCtxPatch';
// Utils
import { downloadData } from "./bundlr";

/**
* Read data directly from Blockchain (Arweave, Filecoin, IPFS, etc.)
* 
* @param {string} network 
* @param {string} prevTxId 
* @returns {Response}
*/
export default async function readData (
  network: string, 
  prevTxId: string
): Promise<Response> {   
  let result: Response;

  // Get data changes
  const changes = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    result = await downloadData(network, prevTxId);
    if (result.status !== ResponseStatus.Ok) return result;
    const data = result.data;
    console.log(`    Data: ${JSON.stringify(data)}`);
    console.log('');
    changes.push(data);
    if (!data.prevTxId) break;
    prevTxId = data.prevTxId;
  }
  changes.reverse();

  // Build data
  const data: any = {};
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i]; 
    aplyPatches(data, change.actions);
  }  

  // Happy end
  return { status: ResponseStatus.Ok, data };
}