import { expect, tap } from '@pushrocks/tapbundle';
import { Qenv } from '@pushrocks/qenv';

const testQenv = new Qenv('./', './.nogit/');

import * as bunq from '../ts';

if (process.env.CI) {
  process.exit(0);
}

let testBunqAccount: bunq.BunqAccount;
const testBunqOptions: bunq.IBunqConstructorOptions = {
  apiKey: testQenv.getEnvVarOnDemand('BUNQ_APIKEY'),
  deviceName: 'mojoiobunqpackage',
  environment: 'SANDBOX'
};

tap.test('should create a valid bunq account', async () => {
  testBunqAccount = new bunq.BunqAccount(testBunqOptions);
  expect(testBunqAccount).to.be.instanceOf(bunq.BunqAccount);
});

tap.test('should init the client', async () => {
  await testBunqAccount.init();
});

tap.test('should get accounts', async () => {
  const accounts = await testBunqAccount.getAccounts();
  console.log(accounts[2].alias);
});

tap.test('should get transactions', async () => {
  const accounts = await testBunqAccount.getAccounts();
  for (const account of accounts) {
    const transactions = await account.getTransactions();
    // console.log(transactions);
  }
});

tap.start();
