//import dayjs = require("dayjs");
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode, AccountsGetRequest, ItemGetRequest, InstitutionsGetByIdRequest, Institution, TransactionsGetRequest, Transaction, LinkTokenCreateResponse, AccountBase, TransactionsSyncRequest, TransactionsSyncResponse, RemovedTransaction } from "plaid";
import { AppSettings } from "../shared/AppSettings";
import { FIKey, FinancialInst, User } from "./Models";


class PlaidService {
        
    private settings:any;
    private plaidClient:PlaidApi;

    constructor() { }

    async loadSettingsFrom (settings:AppSettings) {
        this.settings = await settings.loadSettings();
        this.createClient();
    }


    /**
     * Retrieves top level models for each registered FI.
     * @param user 
     * @returns 
     */
    async retrieveUserFIs(user:User):Promise<FinancialInst[]> {
        return await Promise.all(
            user.fiKeys
                .map(async fiKey => { 
                    return { 
                        itemId: fiKey.itemId,
                        detailInfo: await this.getFiInfo(fiKey.accessToken),
                        accounts: await this.getDepositAccounts(fiKey.accessToken),
                        transactionSync: await this.transactionSync(fiKey)
                    };
                }));
    }


    /**
     * Creates the link token required by Plaid. This is used to trigger the login experience for the user.
     * @param userId 
     * @returns 
     */
    async createLinkToken (userId:string):Promise<LinkTokenCreateResponse> {
        const config = {
                user: { client_user_id: userId },
                client_name: 'Plaid Test App',
                products: [Products.Auth, Products.Transactions],
                language: 'en',
                country_codes: [CountryCode.Us],
                webhook: this.settings.transactionsWebhookUrl,
            };

        const response = await this.plaidClient.linkTokenCreate(config);
        return response.data;
    }

    
    /**
     * Using the public token provided upon successful FI registration, retrieve a permanent access key from Plaid.
     * @param publicToken 
     * @returns 
     */
    async getFiAccessToken (publicToken:string):Promise<FIKey> {
        const response = await this.plaidClient.itemPublicTokenExchange({ public_token: publicToken });
        return new FIKey(response.data.access_token, response.data.item_id);
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

    private async getDepositAccounts(accessToken:string):Promise<AccountBase[]> {

        const request: AccountsGetRequest = {
            access_token: accessToken,
        };

        try
        {
            const resp = await this.plaidClient.accountsGet(request);
            return resp?.data?.accounts;
        } catch (error) {
            throw new Error("Could not load accounts: " + error);
        }
    }

    private async getFiInfo(accessToken:string):Promise<Institution> {
        // First find the institutionId using the access token
        const req:ItemGetRequest = { access_token: accessToken };
        const itemInfo = await this.plaidClient.itemGet(req);
        const institutionId = itemInfo.data.item.institution_id;

        // Next lookup the instituion by id using the institutionId
        const instReq:InstitutionsGetByIdRequest = {
            institution_id: institutionId,
            country_codes: [ CountryCode.Us ]
        };
        const institution = await this.plaidClient.institutionsGetById(instReq);
        
        return institution.data.institution;
    }
}

export default PlaidService;


