import * as plugins from './bunq.plugins';

export const packageDir = plugins.path.join(__dirname, '../');
export const nogitDir = plugins.path.join(packageDir, './.nogit/');

export const bunqJsonFile = plugins.path.join(nogitDir, 'bunq.json');