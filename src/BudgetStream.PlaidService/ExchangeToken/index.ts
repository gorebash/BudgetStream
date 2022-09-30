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
 * For this to work you will need to add the cosmos connection string to your local.settings: UserStore.ConnectionString.
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

            // todo: rename partitionKey to userName. It is mapped from userEmail OAuth property on the client.
            user.pk = { userId: req.body.userId }; 
            
            // todo: this id is the actual cosmos documentId, mapped from the OAuth userId property. Update param names to documentId, but keep the cosmos property as id since it's the doc id.
            user.id = req.body.id; 
        }
        user.fiKeys.push(key);
        
        
        // create or update the user document to the cosmos binding.
        context.bindings.userDocument = JSON.stringify(user);


    } catch (error) {
        context.res = {
            status: 500, 
            body: "Error retrieving token exchange: " + error
        };
    }
};

export default exchangeToken;