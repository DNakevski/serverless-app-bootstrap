#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { API_STACK_NAME_SUFFIX, ApiStack } from './stacks/apiStack';
import { AppProps, createAppProps } from './appProps';
import { StorageStack, STORAGE_STACK_NAME_SUFFIX } from './stacks/storageStack';

const app = new cdk.App();
const appProps: AppProps = createAppProps(app);

const storageStack = new StorageStack(app, 'StorageStack', {
  stackName: `${appProps.appName}-${STORAGE_STACK_NAME_SUFFIX}`,
  ...appProps
});

new ApiStack(app, 'ApiStack', {
  stackName: `${appProps.appName}-${API_STACK_NAME_SUFFIX}`,
  storageStack,
  ...appProps
});
