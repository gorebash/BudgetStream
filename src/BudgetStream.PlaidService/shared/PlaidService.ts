//import dayjs = require("dayjs");
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode, AccountsGetRequest, ItemGetRequest, InstitutionsGetByIdRequest, Institution, TransactionsGetRequest, Transaction, LinkTokenCreateResponse, AccountBase } from "plaid";
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
        let userFIs = new Array<FinancialInst>();
        await Promise.all(
            user.fiKeys
                .map(async (fiKey) => { 
                    const fi:FinancialInst = { 
                        detailInfo: await this.getFiInfo(fiKey.accessToken),
                        accounts: await this.getDepositAccounts(fiKey.accessToken)
                    };
    
                    userFIs.push(fi);
                }));
    
        return userFIs;
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
                products: [Products.Auth],
                language: 'en',
                country_codes: [CountryCode.Us],
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
    

    /**
     * Retrieves the listing of transactions for the provided deposit account. 
     * @param accessToken Private token to auth to linked FI
     * @param accountId Deposit account unique ID
     * @returns Array of transactions for the provided account
     */
    async getTranHist(accessToken:string, accountId: string):Promise<Transaction[]> {

        // todo: date params will need to be provided
        // todo: add date logic to default to past 30 or 90 days
        const request: TransactionsGetRequest = {
            access_token: accessToken,
            start_date: '2022-01-01',
            end_date: '2022-02-15',
            //options: { count: 100 }
        };

        const response = await this.plaidClient.transactionsGet(request);
        let transactions = response.data.transactions;
        const total_transactions = response.data.total_transactions;

        return transactions;
    }



    private async createClient () {
        const client = new PlaidApi(new Configuration({
            basePath: PlaidEnvironments[this.settings.plaidEnv],
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': this.settings.plaidClientId,
                    'PLAID-SECRET': this.settings.plaidSecret,
                    "Plaid-Version": process.env.PlaidVersion
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


