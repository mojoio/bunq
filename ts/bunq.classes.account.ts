import * as plugins from './bunq.plugins';
import * as paths from './bunq.paths';
import { MonetaryAccount } from './bunq.classes.monetaryaccount';

export interface IBunqConstructorOptions {
  deviceName: string;
  apiKey: string;
  environment: 'SANDBOX' | 'PRODUCTION';
}

/**
 * the main bunq account
 */
export class BunqAccount {
  public options: IBunqConstructorOptions;

  public bunqJSClient: plugins.bunqCommunityClient.default;
  public encryptionKey: string;
  public permittedIps = []; // bunq will use the current ip if omitted

  /**
   * user id is needed for doing stuff like listing accounts;
   */
  public userId: number;

  constructor(optionsArg: IBunqConstructorOptions) {
    this.options = optionsArg;
  }

  public async init() {
    this.encryptionKey = plugins.smartcrypto.nodeForge.util.bytesToHex(
      plugins.smartcrypto.nodeForge.random.getBytesSync(16)
    );

    // lets setup bunq client
    await plugins.smartfile.fs.ensureDir(paths.nogitDir);
    await plugins.smartfile.fs.ensureFile(paths.bunqJsonProductionFile, '{}');
    await plugins.smartfile.fs.ensureFile(paths.bunqJsonSandboxFile, '{}');
    let apiKey: string;

    if (this.options.environment === 'SANDBOX') {
      this.bunqJSClient = new plugins.bunqCommunityClient.default(
        plugins.JSONFileStore(paths.bunqJsonSandboxFile)
      );
      apiKey = await this.bunqJSClient.api.sandboxUser.post();
      console.log(apiKey);
    } else {
      this.bunqJSClient = new plugins.bunqCommunityClient.default(
        plugins.JSONFileStore(paths.bunqJsonProductionFile)
      );
      apiKey = this.options.apiKey;
    }

    // run the bunq application with our API key
    await this.bunqJSClient.run(
      apiKey,
      this.permittedIps,
      this.options.environment,
      this.encryptionKey
    );

    // install a new keypair
    await this.bunqJSClient.install();

    // register this device
    await this.bunqJSClient.registerDevice(this.options.deviceName);

    // register a new session
    await this.bunqJSClient.registerSession();
    await this.getUserId();
  }

  /**
   * lists all users
   */
  private async getUserId() {
    const users = await this.bunqJSClient.api.user.list();
    if (users.UserPerson) {
      this.userId = users.UserPerson.id;
    } else if (users.UserApiKey) {
      this.userId = users.UserApiKey.id;
    } else if (users.UserCompany) {
      this.userId = users.UserCompany.id;
    } else {
      console.log('could not determine user id');
    }
  }

  public async getAccounts() {
    const apiMonetaryAccounts = await this.bunqJSClient.api.monetaryAccount
      .list(this.userId, {})
      .catch((e) => {
        console.log(e);
      });
    const accountsArray: MonetaryAccount[] = [];
    for (const apiAccount of apiMonetaryAccounts) {
      accountsArray.push(MonetaryAccount.fromAPIObject(this, apiAccount));
    }
    return accountsArray;
  }

  /**
   * stops the instance
   */
  public async stop() {
    if (this.bunqJSClient) {
      this.bunqJSClient.setKeepAlive(false);
      await this.bunqJSClient.destroyApiSession();
      this.bunqJSClient = null;
    }
  }
}
