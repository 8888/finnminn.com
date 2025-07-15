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
        nickname: { required: true, mutable: true },
        email: { required: true, mutable: true },
        phoneNumber: { required: false, mutable: true },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    const domainName = isProd ? 'auth.finnminn.com' : 'auth.dev.finnminn.com';
    this.userPool.addDomain('UserPoolDomain', {
      customDomain: {
        domainName,
        certificate: this.certificate!,
      },
      managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
    });

    // Create the app client
    const callbackUrls = isProd
      ? [ 'https://app.finnminn.com' ]
      : [ 'http://localhost:5173', 'https://app.dev.finnminn.com' ];

    const logoutUrls = callbackUrls; // TODO: Add logout URL to auth page

    this.userPoolClient = this.userPool.addClient('WebClient', {
      generateSecret: false,
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
  }
}
