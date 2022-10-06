export interface LinkToken {
  expiration: any;
  link_token?: string;
  request_id: any;
}

export interface FIModel {
  detailInfo: any;
  accounts: Array<any>;
}

export interface SyncResult {
  userFIs: any, // this is a FinancialInst[]
  initialSync: any
}