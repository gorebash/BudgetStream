import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { AppSettings } from "../shared/AppSettings";
import { FinancialInst, User } from "../shared/Models";
import PlaidService from "../shared/PlaidService";

const transactionsFunc: AzureFunction = async function (context: Context, req: HttpRequest, user:User): Promise<void> {
    const plaidService = new PlaidService();
    await plaidService.loadSettingsFrom(new AppSettings());

    if (!req.body?.accountId) {
        context.res = {
            status: 400, 
            body: "Invalid account provided."
        };
        context.done();
    }

    const accountId:string = req.body.accountId;
    try {
        // todo: iterate, this might be a list
        // todo: check for any inst
        const fi = user.fiKeys[0];

        const transactions = await plaidService.getTranHist(fi.accessToken, accountId);
        
        context.res = {
            body: {
                transactions
            }
        };

    } catch (error) {
        context.log(error);
        context.res = {
            status: 500,
            body: "Unable to retrieve transactions: " + error
        };
    }
    
    context.done();

};

export default transactionsFunc;