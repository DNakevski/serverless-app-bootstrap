import { App, Environment, StackProps } from 'aws-cdk-lib';
import { DefaultEnvironmentSettingsPerAccount, EnvironmentSettings } from './environments/environmentSettings';
import { ApiAppProps } from './stacks/apiStack';
import { StorageAppProps } from './stacks/storageStack';

const DEFAULT_APP_NAME = 'serverless-app';

export interface AppProps extends StackProps, ApiAppProps, StorageAppProps {
  env: Required<Environment>;
  appName: string;
}

export function createAppProps(app: App): AppProps {
  const env = calcEnvironment();
  const appName = calcAppName(app);
  return {
    env,
    appName,
    ...calcEnvironmentSettings(env.account)
  };
}

export function calcEnvironment(): Required<Environment> {
  const account = process.env.CDK_DEFAULT_ACCOUNT;
  const region = process.env.CDK_DEFAULT_REGION;

  if (account && region) return { account, region };

  throw new Error('Unable to read CDK_DEFAULT_ACCOUNT or CDK_DEFAULT_REGION');
}

export function calcAppName(app: App) {
  return app.node.tryGetContext('appName') || DEFAULT_APP_NAME;
}

function calcEnvironmentSettings(account: string): EnvironmentSettings {
  const accountSettings = DefaultEnvironmentSettingsPerAccount[account];
  if (accountSettings) {
    console.log(`Using environment settings for account ${account}`);
  } else {
    throw new Error(`Unable to find environment settings for current account: ${account}`);
  }

  console.log(`Using the following environment settings: ${JSON.stringify(accountSettings)}`);

  return accountSettings;
}
