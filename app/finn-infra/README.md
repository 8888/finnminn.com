# Finn
## Urls
App:  
* Prod: https://app.finnminn.com (https://d2wx66qk2896tj.cloudfront.net)
* Dev: https://app.dev.finnminn.com (https://dcqz8jobbekl8.cloudfront.net)

Login:
* Prod: https://auth.finnminn.com
* Dev: https://auth.dev.finnminn.com

## Manual configs
* Route52 in main account
  * CNAME records to validate prod and dev certs
  * A alias records for prod and dev cloudfront distros for `app.`

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
