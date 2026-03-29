#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LiamolesStack } from '../lib/liamoles-stack';

const app = new cdk.App();
new LiamolesStack(app, 'LiamolesStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});
