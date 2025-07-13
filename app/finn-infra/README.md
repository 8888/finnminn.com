# Finn
## Urls
App:  
* Prod: https://app.finnminn.com (https://d2wx66qk2896tj.cloudfront.net)
* Dev: https://app.dev.finnminn.com (https://dcqz8jobbekl8.cloudfront.net)

Login:
* Prod: https://auth.finnminn.com
* Dev: https://auth.dev.finnminn.com
  * localhost: https://auth.dev.finnminn.com/login?client_id=642bvhtf4m9o5nngcu4bjfic11&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F

## Manual configs
* Route52 in main account
  * CNAME records to validate prod and dev certs
  * A alias records for prod and dev cloudfront distros for `app.`
  * A alias records to point finnminn.com and dev.finnminn.com to something we own. This allows cognito to confirm we own the top domains for creating custom subdomains later. Currently both are pointing to cloudfront distro with a finn pic (d2e78oxnaxyz4a.cloudfront.net)
  * A alias records from auth.finnminn.com and auth.dev.finnminn.com to the cloudfront distro target alias the cognito custom domain

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
