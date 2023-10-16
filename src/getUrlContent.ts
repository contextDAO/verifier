import axios from 'axios';
import { Response, ResponseStatus } from './types/types';

export default async function getUrlContent(url: string): Promise<Response> { 
  return new Promise((resolve) => {
    axios.get(url)
    .then((response) => {
      resolve({ status: ResponseStatus.Ok, data: response.data });
    })
    .catch((error) => {
      resolve({ status: ResponseStatus.Error, message: error.message });
    });
  });
}