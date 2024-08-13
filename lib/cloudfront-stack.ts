import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import {ApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";

interface CloudFrontStackProps extends cdk.StackProps {
    vpc: ec2.IVpc;
    lb: ApplicationLoadBalancer;
}

export class CloudfrontStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
        super(scope, id, props);

        // Create a CloudFront distribution pointing to the ALB
        const distribution = new cloudfront.Distribution(this, 'MyCloudFrontDistribution', {
            defaultBehavior: {
                origin: new origins.LoadBalancerV2Origin(props.lb, {
                    protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                    httpPort: 8080
                }),
            },
        });

        // Output the DNS name of the CloudFront distribution
        new cdk.CfnOutput(this, 'CloudFrontURL', {
            value: distribution.distributionDomainName
        });
    }
}

