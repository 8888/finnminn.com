import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface CognitoAuthProps {
  isProd: boolean;
}

export class CognitoAuth extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly hostedUiUrl: string;

  constructor(scope: Construct, id: string, props: CognitoAuthProps) {
    super(scope, id);

    // Create the user pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        nickname: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    // Create the app client
    const callbackUrl = props.isProd
      ? 'https://app.finnminn.com'
      : 'http://localhost:5173/';

    const logoutUrl = callbackUrl;

    this.userPoolClient = this.userPool.addClient('WebClient', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [callbackUrl],
        logoutUrls: [logoutUrl],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // Construct the hosted UI URL
    const region = cdk.Stack.of(this).region;
    const userPoolId = this.userPool.userPoolId;
    const clientId = this.userPoolClient.userPoolClientId;

    this.hostedUiUrl = `https://${userPoolId}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(callbackUrl)}`;

    // Output the hosted UI URL
    new cdk.CfnOutput(this, 'CognitoHostedUiUrl', {
      value: this.hostedUiUrl,
      description: 'URL for the Cognito hosted UI',
    });
  }
}
