import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WebHosting } from './constructs/web-hosting';

export class FinnInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webHosting = new WebHosting(this, 'WebHosting');
  }
}
