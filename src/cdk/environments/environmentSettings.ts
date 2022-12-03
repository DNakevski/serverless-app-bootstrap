import { RemovalPolicy } from 'aws-cdk-lib';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export interface EnvironmentSettings {
  readonly logFullEvents: boolean;
  readonly logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  readonly logRetention: RetentionDays;
  readonly additionalDynamoDbOptions: { readonly removalPolicy: RemovalPolicy };
}

export const DefaultEnvironmentSettingsPerAccount: Record<string, EnvironmentSettings> = {
  // ** DEV ACCOUNT **
  '<your-dev-account-id>': {
    logFullEvents: true,
    logLevel: 'DEBUG',
    logRetention: RetentionDays.ONE_WEEK,
    additionalDynamoDbOptions: {
      removalPolicy: RemovalPolicy.DESTROY
    }
  },
  // ** PROD ACCOUNT **
  '<your-production-account-id>': {
    // Set this to false once traffic ramps up
    logFullEvents: true,
    logLevel: 'INFO',
    logRetention: RetentionDays.ONE_YEAR,
    additionalDynamoDbOptions: {
      removalPolicy: RemovalPolicy.RETAIN
    }
  }
};
