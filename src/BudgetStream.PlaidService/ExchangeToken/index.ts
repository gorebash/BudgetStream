import { AzureFunction, Context } from "@azure/functions"
import { AppSettings } from "../shared/AppSettings";
import { AuthReqest } from '../shared/AuthMiddleware.types';
import { User } from "../shared/Models";
import PlaidService from "../shared/PlaidService";


/**
 * Token exchange
 * This function will use the provided public token in exchange for the users FI access key and plaid itemId.
 * The itemId represents a financial institution relationship to the user.
 * The retrived access key and ID to the cosmos user store.
 * 
 * For this to work you will need to add the cosmos connection string to your local.settings: MiraUserStorage.ConnectionString.
 * 
 * @param context 
 * @param req The request should contain a plaid provided publicToken and the logged in userId.
 */
const exchangeToken: AzureFunction = async function (context: Context, req: AuthReqest, user:User): Promise<void> {
  
    if (!req.body?.publicToken) {
        context.res = {
            status: 400, 
            body: "Invalid token provided."
        };
        context.done();
    }
    
    const publicToken = req.body.publicToken;
    const plaidService = new PlaidService(); 
    await plaidService.loadSettingsFrom(new AppSettings());

    try {
        const key = await plaidService.getFiAccessToken(publicToken);
        
        if (!user) {
            user = new User();
            user.pk = { userId: req.body.userId };
            user.id = req.body.userId; //todo: change email address or a unique document value
        }
        user.fiKeys.push(key);
        
        
        // save the user document to the cosmos binding.
        // todo: add this to a que instead
        context.bindings.userDocument = JSON.stringify(user);
        context.done();


    } catch (error) {
        context.res = {
            status: 500, 
            body: "Error retrieving token exchange: " + error
        };
    }
};

export default exchangeToken;