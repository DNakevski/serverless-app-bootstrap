import { Stack, StackProps, Environment } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiFunctionEnvironmentConfig } from '../constructs/ApiFunction';
import { defineAppFunctions } from './appStackResources/appFunctions';
import { defineApplicationApi } from './appStackResources/api';
import { StorageStack } from './storageStack';

export const API_STACK_NAME_SUFFIX = 'api';

export type ApiAppProps = ApiFunctionEnvironmentConfig;

export interface ApiStackProps extends ApiAppProps, StackProps {
  env: Required<Environment>;
  appName: string;
  stackName: string;
  storageStack: StorageStack;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const appFunctions = defineAppFunctions(this, props);

    defineApplicationApi(this, {
      appName: props.appName,
      appFunctions: appFunctions
    });
  }
}
