import { AzureFunction, Context } from "@azure/functions";
import { AppSettings } from "../shared/AppSettings";
import { AuthMiddleware } from '../shared/AuthMiddleware';
import { AuthReqest } from '../shared/AuthMiddleware.types';
import PlaidService from "../shared/PlaidService";

const httpTrigger: AzureFunction = async function (context: Context, req: AuthReqest): Promise<void> {

    const plaidService = new PlaidService();
    await plaidService.loadSettingsFrom(new AppSettings());
    //const userId = req.userId;
    
    // todo: create linkInfo model

    const header = req.headers['x-ms-client-principal'];
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');

    const userInfo = JSON.parse(decoded);
    context.log(userInfo);
    const userId:string = userInfo.userId;
    
    try {
        const linkInfo = await plaidService.createLinkToken(userId);

        context.res = {
            status: 200,
            body: linkInfo
        };
    } catch (error) {
        context.log(error);
        context.res = {
            status: 500,
            body: "Unable to create link token: " + error,
            //clientPrincipal: JSON.parse(decoded),
        };
    }
    
    context.done();    
}

export default httpTrigger;

//const authed = new AuthMiddleware({ next: httpTrigger });
//export default authed.func;