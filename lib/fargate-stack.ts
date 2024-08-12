import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface FargateStackProps extends cdk.StackProps {
    vpc: ec2.IVpc;
}

export class FargateStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: FargateStackProps) {
        super(scope, id, props);

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'ecs-cluster', {
            vpc: props.vpc,
        });

        // Define a Fargate task definition with an NGINX container
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'ecs-task-definition', {
            memoryLimitMiB: 512,
            cpu: 256,
        });

        // Download NGINX from online registry
        const container = taskDefinition.addContainer('nginx', {
            image: ecs.ContainerImage.fromRegistry('nginx'),
            logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'nginx' }),
        });

        container.addPortMappings({
            containerPort: 80,
        });

        // Create a Fargate service
        const service = new ecs.FargateService(this, 'alma-fargate-service', {
            cluster,
            taskDefinition,
            desiredCount: 1,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
        });

        // Create an Application Load Balancer
        const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'alma-lb', {
            vpc: props.vpc,
            internetFacing: true,
        });

        // Set listener port to 8080
        const listener = loadBalancer.addListener('alma-listener', {
            port: 8080,
            open: true,
        });

        // Map the port to 8080
        listener.addTargets('ECS', {
            port: 8080,
            targets: [service],
            healthCheck: {
                path: '/',
            },
        });

        // Output the LB DNS name
        new cdk.CfnOutput(this, 'LoadBalancerDNS', {
            value: loadBalancer.loadBalancerDnsName,
        });

        // Create a CloudFront distribution pointing to the ALB
        // const distribution = new cloudfront.Distribution(this, 'MyCloudFrontDistribution', {
        //     defaultBehavior: {
        //         origin: new origins.LoadBalancerV2Origin(loadBalancer, {
        //             protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
        //         }),
        //     },
        // });

        // Output the DNS name of the CloudFront distribution
        // new cdk.CfnOutput(this, 'CloudFrontURL', {
        //     value: distribution.distributionDomainName,
        // });
    }
}