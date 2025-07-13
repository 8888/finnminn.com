import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';

export interface CognitoAuthProps {
  readonly isProd?: boolean;
  readonly certificate?: ICertificate;
}

export class CognitoAuth extends Construct {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly hostedUiUrl: string;
  public readonly certificate?: ICertificate;

  constructor(scope: Construct, id: string, props: CognitoAuthProps) {
    super(scope, id);

    const isProd = !!props.isProd;
    this.certificate = props.certificate;

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
    const callbackUrls = isProd
      ? [ 'https://app.finnminn.com' ]
      : [ 'http://localhost:5173/', 'https://app.dev.finnminn.com' ];

    const logoutUrls = callbackUrls; // TODO: Add logout URL to auth page

    this.userPoolClient = this.userPool.addClient('WebClient', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // Construct the hosted UI URL
    const region = cdk.Stack.of(this).region;
    const userPoolId = this.userPool.userPoolId;
    const clientId = this.userPoolClient.userPoolClientId;

    this.hostedUiUrl = `https://${userPoolId}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(callbackUrls[0])}`;

    // Output the hosted UI URL
    new cdk.CfnOutput(this, 'CognitoHostedUiUrl', {
      value: this.hostedUiUrl,
      description: 'URL for the Cognito hosted UI',
    });
  }
}
