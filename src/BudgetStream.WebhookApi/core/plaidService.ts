import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode, AccountsGetRequest, ItemGetRequest, InstitutionsGetByIdRequest, Institution, TransactionsGetRequest, Transaction, LinkTokenCreateResponse, AccountBase, TransactionsSyncRequest, TransactionsSyncResponse, RemovedTransaction } from "plaid";
import { AppSettings } from "../core/AppSettings";
import { FIKey, FinancialInst, User } from "./Models";

class PlaidService {

    private settings:any;
    private plaidClient:PlaidApi;

    constructor() { }

    async loadSettingsFrom (settings:AppSettings) {
        this.settings = await settings.loadSettings();
        this.createClient();
    }

    async transactionSync (fi:FIKey):Promise<TransactionsSyncResponse> {
        
        // Provide a cursor from your database if you've previously
        // received one for the Item. Leave null if this is your
        // first sync call for this Item. The first request will
        // return a cursor.
        let cursor = fi.cursor;

        // New transaction updates since "cursor"
        let added: Array<Transaction> = [];
        let modified: Array<Transaction> = [];
        let removed: Array<RemovedTransaction> = [];
        let hasMore = true;

        // todo: just getting first page for now, eventually get all pages.
        // Iterate through each page of new transaction updates for item
        //while (hasMore) {
            const request: TransactionsSyncRequest = {
                access_token: fi.accessToken,
                cursor: cursor,
            };
            const response = await this.plaidClient.transactionsSync(request)
            const data = response.data;

            // Add this page of results
            added = added.concat(data.added);
            modified = modified.concat(data.modified);
            removed = removed.concat(data.removed);
            hasMore = data.has_more;

            // Update cursor to the next cursor
            cursor = data.next_cursor;
        //}

        // Persist cursor and updated data
        //database.applyUpdates(itemId, added, modified, removed, cursor);
        //fi.cursor = cursor;

        return data;
    }


    private async createClient () {
        const client = new PlaidApi(new Configuration({
            //basePath: PlaidEnvironments[this.settings.plaidEnv],
            basePath: PlaidEnvironments.sandbox, // todo: fix.
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': this.settings.plaidClientId,
                    'PLAID-SECRET': this.settings.plaidSecret,
                    "Plaid-Version": this.settings.plaidVersion
                },
            },
        }));

        this.plaidClient = client;
    }
}

export default PlaidService;