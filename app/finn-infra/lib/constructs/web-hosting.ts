import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Tags } from 'aws-cdk-lib';

export class WebHosting extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create an S3 bucket for static assets
    this.bucket = new s3.Bucket(this, 'StaticAssetsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change to RETAIN for production
      autoDeleteObjects: true, // For development - remove for production
    });

    Tags.of(this.bucket).add('Project', 'finnminn');
    Tags.of(this.bucket).add('Resource', 'static-assets-bucket');

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity');

    // Create a CloudFront distribution
    this.distribution = new cloudfront.Distribution(this, 'StaticAssetsDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
    });

    Tags.of(this.distribution).add('Project', 'finnminn');
    Tags.of(this.distribution).add('Resource', 'cloudfront-distribution');

    // Add bucket policy to allow CloudFront access
    const bucketPolicy = new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      effect: iam.Effect.ALLOW,
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
      resources: [this.bucket.arnForObjects('*')],
    });

    this.bucket.addToResourcePolicy(bucketPolicy);

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'The domain name of the CloudFront distribution',
    });

    new cdk.CfnOutput(this, 'StaticAssetsBucketName', {
      value: this.bucket.bucketName,
      description: 'The name of the S3 bucket',
    });
  }
}
