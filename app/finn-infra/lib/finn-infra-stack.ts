import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebHosting } from './constructs/web-hosting';
import { CognitoAuth } from './constructs/cognito-auth';

export class FinnInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const isProd = !!this.node.tryGetContext('prod');

    const webHosting = new WebHosting(this, 'WebHosting', { isProd });
    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', { isProd });
  }
}
