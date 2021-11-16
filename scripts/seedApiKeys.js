// DEBUG=app:* node src/utils/scripts/seedApiKeys.js

const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-keys');
const apiKeysModel = require('../src/models/apiKeys');

const supervisorScopes = [
    'signin:auth',
    'signup:auth',
    'read:seed',
    'create:seed',
    'update:seed',
    'delete:seed',
    'read:user',
    'create:user',
    'update:user',
    'delete:user',
    'read:message',
    'create:message',
    'update:message',
    'delete:message',
    'read:calendar',
    'create:calendar',
    'update:calendar',
    'delete:calendar',
    'read:greenhouse',
    'create:greenhouse',
    'update:greenhouse',
    'delete:greenhouse',
];

const employeeScopes = [
    'signin:auth',
    'signup:auth',
    'read:seed',
    'read:user',
    'update:user',
    'read:message',
    'create:message',
    'read:calendar',
    'read:greenhouse',
];

const apiKeys = [
  {
    token: generateRandomToken(),
    scopes: supervisorScopes
  },
  {
    token: generateRandomToken(),
    scopes: employeeScopes
  }
];

function generateRandomToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}

async function seedApiKeys() {
    try {
        const promises = apiKeys.map(async apiKey => {
        await apiKeysModel.create(apiKey);
        });
        await Promise.all(promises);
        debug(chalk.green(`${promises.length} api keys have been created succesfully`));
        return process.exit(0);
    } catch (error) {
        debug(chalk.red(error));
        process.exit(1);
    }
}

seedApiKeys();