import * as plugins from './bunq.plugins';
import { BunqMonetaryAccount } from './bunq.classes.monetaryaccount';

export class BunqTransaction {
  public static fromApiObject(monetaryAccountRefArg: BunqMonetaryAccount, apiObjectArg: any) {
    const newTransaction = new this(monetaryAccountRefArg);
    Object.assign(newTransaction, apiObjectArg.Payment);
    return newTransaction;
  }

  public id: number;
  public created: string;
  public updated: string;
  public monetary_account_id: number;
  public amount: {
    currency: string;
    value: string;
  };
  public description: string;
  public type: 'MASTERCARD' | 'BUNQ';
  public merchant_reference: null;
  public alias: [Object];
  public counterparty_alias: [Object];
  public attachment: [];
  public geolocation: null;
  public batch_id: null;
  public allow_chat: boolean;
  public scheduled_id: null;
  public address_billing: null;
  public address_shipping: null;
  public sub_type: 'PAYMENT';
  public request_reference_split_the_bill: [];
  public balance_after_mutation: {
    currency: string;
    value: string;
  };

  public monetaryAccountRef: BunqMonetaryAccount;

  constructor(monetaryAccountRefArg: BunqMonetaryAccount) {
    this.monetaryAccountRef = monetaryAccountRefArg;
  }
}
