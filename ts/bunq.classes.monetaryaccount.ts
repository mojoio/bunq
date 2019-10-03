import * as plugins from './bunq.plugins';
import { BunqAccount } from './bunq.classes.account';
import { Transaction } from './bunq.classes.transaction';

export type TAccountType = 'joint' | 'savings' | 'bank';

/**
 * a monetary account
 */
export class MonetaryAccount {
  public static fromAPIObject(bunqAccountRef: BunqAccount, apiObject: any) {
    const newMonetaryAccount = new this(bunqAccountRef);

    let type: TAccountType;
    let accessor: 'MonetaryAccountBank' | 'MonetaryAccountJoint' | 'MonetaryAccountSavings';

    switch (true) {
      case !!apiObject.MonetaryAccountBank:
        type = 'bank';
        accessor = 'MonetaryAccountBank';
        break;
      case !!apiObject.MonetaryAccountJoint:
        type = 'joint';
        accessor = 'MonetaryAccountJoint';
        break;
      case !!apiObject.MonetaryAccountSavings:
        type = 'savings';
        accessor = 'MonetaryAccountSavings';
        break;
      case !!apiObject.default:
        console.log(apiObject);
        throw new Error('unknown accoun type');
    }

    Object.assign(newMonetaryAccount, apiObject[accessor], {type});
    return newMonetaryAccount;
  }

  // computed
  public type: TAccountType;

  // from API
  public id: number;
  public created: string;
  public updated: string;
  public alias: any[];
  public avatar: {
    uuid: string;
    image: any[];
    anchor_uuid: string;
  };
  public balance: {
    currency: string;
    value: string;
  };
  public country: string;
  public currency: string;
  public daily_limit: {
    currency: string;
    value: string;
  };
  public daily_spent: {
    currency: string;
    value: string;
  };
  public description: string;
  public public_uuid: string;
  public status: string;
  public sub_status: string;
  public timezone: string;
  public user_id: number;
  public monetary_account_profile: null;
  public notification_filters: any[];
  public setting: any[];
  public connected_cards: any[];
  public overdraft_limit: {
    currency: string;
    value: string;
  };
  public reason: string;
  public reason_description: string;
  public auto_save_id: null;
  public all_auto_save_id: any[];


  public bunqAccountRef: BunqAccount;
  constructor(bunqAccountRefArg: BunqAccount) {
    this.bunqAccountRef = bunqAccountRefArg;
  }

  /**
   * gets all transactions no this account
   */
  public async getTransactions() {
    const apiTransactions = await this.bunqAccountRef.bunqJSClient.api.payment.list(this.bunqAccountRef.userId, this.id);
    const transactionsArray: Transaction[] = [];
    for (const apiTransaction of apiTransactions) {
      transactionsArray.push(Transaction.fromApiObject(this, apiTransaction));
    }
    return transactionsArray;
  }
}
