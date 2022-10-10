import { AppConfigurationClient } from '@azure/app-configuration';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from "@azure/keyvault-secrets";

export class AppSettings {
  private connString: string = process.env.AzureAppConfigConnectionString;
  private credential: DefaultAzureCredential;
  private appConfig: AppConfigurationClient;
  private env:string = process.env.env;
  private _settings;

  constructor() {
    this.credential = new DefaultAzureCredential();
    this.appConfig = new AppConfigurationClient(this.connString);
  }

  async loadSettings() {

    if (this._settings)
        return this._settings;

    try {
      this._settings = {
        plaidEnv: process.env.plaidEnv,
        plaidClientId: await this.getAppConfigSetting("Plaid:ClientId"),
        plaidSecret: await this.getSecret("KV:Plaid:Secret"),
        plaidVersion: process.env.plaidVersion,
        transactionsWebhookUrl: process.env.transactionsWebhookUrl
      };

      return this._settings;

    } catch (ex) {
      // log.
      throw new Error('Unable to find requested app settings: ' + ex);
    }
  }

  private async getAppConfigSetting (key:string) {
    try {
      const setting = await this.appConfig.getConfigurationSetting({
        key, label: this.env
      });

      return setting?.value;
    }
    catch {
      throw new Error(`${key} unable to be reteived from app config.`);
    }
    
  }

  private async getSecret(secretName: string): Promise<string> {
    try {
      const kvUrl = await this.getAppConfigSetting(secretName);
      var uri = JSON.parse(kvUrl).uri;
      var secretClient = new SecretClient(uri, this.credential);
      const secret = await secretClient.getSecret(uri);

      return secret?.value;
    } catch (ex) {
      throw new Error('Unable to find requested key vault secret: ' + ex);
    }
  }

}