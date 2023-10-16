
export type Response = {
  status: ResponseStatus;
  data?: any;
  message?: string;
}

export enum ResponseStatus {
  Ok = "ok",
  Error = "error",
  Warning = "warning",
}

export type DataActionType = 'write' | 'push' | 'delete' | 'upload';

// Data action Object.
export interface DataAction {
  action: DataActionType;
  path: string;
  data?: any;
  assetName?: string;
  keep?: string[];
}