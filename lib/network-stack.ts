import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {getConfig} from '../config/config';

export class NetworkStack extends cdk.Stack {
    public readonly vpc: ec2.IVpc;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const config = getConfig();

        // Lookup the existing VPC
        this.vpc = ec2.Vpc.fromLookup(this, config.vpc_id, {
            vpcName: config.vpc_name,
        });
    }
}
