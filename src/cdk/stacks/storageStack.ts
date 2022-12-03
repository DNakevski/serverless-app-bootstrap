import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { TableProps } from 'aws-cdk-lib/aws-dynamodb/lib/table';
import { aws_dynamodb as dynamodb, CfnOutput, Environment, Stack, StackProps } from 'aws-cdk-lib';

export const STORAGE_STACK_NAME_SUFFIX = 'storage';

export type DynamoDbOptions = Omit<TableProps, 'partitionKey' | 'sortKey'>;

export interface StorageAppProps {
  additionalDynamoDbOptions: DynamoDbOptions;
}
export interface StorageStackProps extends StorageAppProps, StackProps {
  env: Required<Environment>;
  stackName: string;
}

export class StorageStack extends Stack {
  public readonly mainTable: Table;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    this.mainTable = createGenericTable(this, 'MainTable', props.additionalDynamoDbOptions);
  }
}

function createGenericTable(scope: Construct, tableId: string, additionalDynamoDbOptions: DynamoDbOptions) {
  const table = new dynamodb.Table(scope, tableId, {
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    timeToLiveAttribute: 'ttl',
    partitionKey: {
      name: 'PK',
      type: dynamodb.AttributeType.STRING
    },
    sortKey: {
      name: 'SK',
      type: dynamodb.AttributeType.STRING
    },
    ...additionalDynamoDbOptions
  });

  table.addGlobalSecondaryIndex({
    indexName: 'GSI1',
    partitionKey: {
      name: 'GSI1PK',
      type: dynamodb.AttributeType.STRING
    },
    sortKey: {
      name: 'GSI1SK',
      type: dynamodb.AttributeType.STRING
    }
  });

  new CfnOutput(scope, `${tableId}Name`, {
    value: table.tableName
  });

  new CfnOutput(scope, `${tableId}Arn`, {
    value: table.tableArn
  });

  return table;
}
