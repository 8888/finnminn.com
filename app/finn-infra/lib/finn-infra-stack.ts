import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class FinnInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for static assets
    const staticAssetsBucket = new s3.Bucket(this, 'StaticAssetsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change to RETAIN for production
      autoDeleteObjects: true, // For development - remove for production
    });

    // Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'StaticAssetsDistribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(`${staticAssetsBucket.bucketName}.s3.amazonaws.com`),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'The domain name of the CloudFront distribution',
    });

    new cdk.CfnOutput(this, 'StaticAssetsBucketName', {
      value: staticAssetsBucket.bucketName,
      description: 'The name of the S3 bucket',
    });
  }
}
