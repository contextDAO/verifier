import { Response, ResponseStatus } from './types/types';
import getUrlContent from "./getUrlContent";


/**
 *  Download data
 *
 * @param {string} network 
 * @param {string} txId 
 * @returns {Response}
 */
export const downloadData = async (network: string, txId: string): Promise<Response> => {
  const url = network !== 'mainnet' ? `https://arweave.dev/${txId}` : `https://arweave.net/${txId}`;
  console.log(`  > TxId: ${url}`);
  // Get content
  const result = await getUrlContent(url);
  if (result.status !== ResponseStatus.Ok) return result;
  return { status: ResponseStatus.Ok, data: result.data};  
};
