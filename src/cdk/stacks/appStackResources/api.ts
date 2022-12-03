import { Construct } from 'constructs';
import { AppFunctions } from './appFunctions';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnOutput, Duration } from 'aws-cdk-lib';

export interface ApiProps {
  appName: string;
  appFunctions: AppFunctions;
}

export function defineApplicationApi(scope: Construct, props: ApiProps) {
  // The (currently experimental) HTTP API construct doesn't generate a stack-specific
  // name (unlike most constructs) so we need to specify one
  const apiGwName = `${props.appName}-API`;
  const serviceMethods = [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PUT, HttpMethod.PATCH];

  //API definition ------------------------------------------
  const apiGw = new HttpApi(scope, apiGwName, {
    description: 'Http Api',
    createDefaultStage: true,
    corsPreflight: {
      allowHeaders: ['Authorization', 'Content-Type', '*', 'X-Api-Key'],
      allowMethods: [
        CorsHttpMethod.GET,
        CorsHttpMethod.POST,
        CorsHttpMethod.DELETE,
        CorsHttpMethod.PUT,
        CorsHttpMethod.PATCH,
        CorsHttpMethod.OPTIONS
      ],
      allowOrigins: ['http://localhost:3000', 'https://*'],
      allowCredentials: true,
      maxAge: Duration.days(10)
    }
  });

  const appFunctions = props.appFunctions;

  apiGw.addRoutes({
    path: '/test/{proxy+}',
    methods: serviceMethods, // OR individual method if needed like [HttpMethod.GET],
    integration: new HttpLambdaIntegration('test', appFunctions.testFunction)
  });

  new CfnOutput(scope, 'URL', {
    value: apiGw.apiEndpoint
  });
}
