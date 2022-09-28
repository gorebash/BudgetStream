import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { AppSettings } from "../shared/AppSettings";
import { FinancialInst, User } from "../shared/Models";
import PlaidService from "../shared/PlaidService";


/**
 * FinanceInfo
 * Takes an array of user FI keys and returns an array of FinantialInst items containing FI detail and account lists.
 * 
 * @param context 
 * @param req Must contain an Id for the document and a userId for the requested user. 
 *  (For now, use the same ID for both values, the Auth0 userId)
 * @param user User document from Cosmos provided by the storage binding
 */
const financeInfo: AzureFunction = async function (context: Context, req: HttpRequest, user:User): Promise<void> {

    const plaidService = new PlaidService();
    await plaidService.loadSettingsFrom(new AppSettings());

    if (!user) {
        // No matching user document found in Cosmos binding.
        context.res = {
            status: 404, // todo: may need to change to a better status code
            body: {}
        };
    }

    else {
        try {
            
            const userFIs = await plaidService.retrieveUserFIs(user);
            context.res = {
                body: userFIs
            };

        } catch (error) {
            context.log(error);
            context.res = {
                status: 500,
                body: "Unable to retrieve FI info: " + error
            };
        }
    }
    
    context.done();
};

export default financeInfo;