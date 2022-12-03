import { aws_lambda as lambda, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FunctionProps } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Optional } from '../../shared/utils/types';

export interface ApiFunctionEnvironmentConfig {
  appName: string;
  logFullEvents: boolean;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

interface ApiFunctionProps
  extends ApiFunctionEnvironmentConfig,
    Optional<FunctionProps, 'code' | 'handler' | 'runtime'> {
  functionSourceDirectory: string;
}

export class ApiFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ApiFunctionProps) {
    super(scope, id, {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `../app/lambdaFunctions/${props.functionSourceDirectory}/lambda.ts`,
      // Equivalent to 1 VCPU - see https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console
      memorySize: 1769,
      timeout: Duration.seconds(30),
      tracing: lambda.Tracing.ACTIVE,
      logRetention: props.logRetention,
      bundling: {
        target: 'node18',
        sourceMap: true,
        sourceMapMode: SourceMapMode.INLINE,
        sourcesContent: false
      },
      // Since this is last then any optional properties it contains will override the above ones
      ...props
    });
    this.addEnvironment('LOG_LEVEL', props.logLevel);
  }
}
