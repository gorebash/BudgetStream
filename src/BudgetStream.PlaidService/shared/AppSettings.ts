import { AppConfigurationClient } from '@azure/app-configuration';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export class AppSettings {
  private connString: string = process.env.AzureAppSettingsConnStr;
  private credential: DefaultAzureCredential;
  private appConfig: AppConfigurationClient;

  constructor() {
    this.credential = new DefaultAzureCredential();
    this.appConfig = new AppConfigurationClient(this.connString);
  }

  async loadSettings() {
    try {
      return {
        plaidEnv: process.env.PlaidEnv,
        plaidClientId: await this.getSecret('Plaid:ClientId:Sandbox'),
        plaidSecret: await this.getSecret('Plaid:SecretKey:Sandbox'),
      };
    } catch (ex) {
      // log.
      throw new Error('Unable to find requested app settings: ' + ex);
    }
  }

  private async getSecret(secretName: string): Promise<string> {
    try {
      const kvUrl = await this.appConfig.getConfigurationSetting({
        key: secretName,
      });
      var uri = JSON.parse(kvUrl.value).uri;
      var secretClient = new SecretClient(uri, this.credential);
      const secret = await secretClient.getSecret(uri);

      return secret?.value;
    } catch (ex) {
      throw new Error('Unable to find requested key vault secret: ' + ex);
    }
  }
}
