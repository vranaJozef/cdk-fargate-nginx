#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { FargateStack } from '../lib/fargate-stack';
import { CloudfrontStack } from '../lib/cloudfront-stack';
import {getConfig} from '../config/config';

const app = new cdk.App();

const config = getConfig();

// Instantiate stack
const networkStack = new NetworkStack(app, 'NetworkStack', {
    env: {
        region: config.region,
        account: config.account_id
    },
});

const fargateStack = new FargateStack(app, 'FargateStack', {
    vpc: networkStack.vpc,
});

new CloudfrontStack(app, "CloudfrontStack", {
    vpc: networkStack.vpc,
    lb: fargateStack.lb
});

app.synth();





