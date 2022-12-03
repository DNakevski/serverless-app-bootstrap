import { Construct } from 'constructs';
import { ApiFunction } from '../../constructs/ApiFunction';
import { ApiStackProps } from '../apiStack';

export interface AppFunctions {
  testFunction: ApiFunction;
}

export function defineAppFunctions(scope: Construct, props: ApiStackProps): AppFunctions {
  const testFunction = new ApiFunction(scope, 'testFunction', {
    functionName: `${props.appName}-testFunction`,
    functionSourceDirectory: 'test',
    ...props
  });
  props.storageStack.mainTable.grantReadData(testFunction);

  return {
    testFunction
  };
}
