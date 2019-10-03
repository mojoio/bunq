import * as plugins from './bunq.plugins';

export const packageDir = plugins.path.join(__dirname, '../');
export const nogitDir = plugins.path.join(packageDir, './.nogit/');

export const bunqJsonProductionFile = plugins.path.join(nogitDir, 'bunqproduction.json');
export const bunqJsonSandboxFile = plugins.path.join(nogitDir, 'bunqsandbox.json');