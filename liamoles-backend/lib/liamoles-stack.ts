import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as path from 'path';

export class LiamolesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table — single item stores the liamole balance
    const table = new dynamodb.Table(this, 'LiamolesTable', {
      tableName: 'liamoles',
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Lambda function
    const fn = new lambda.Function(this, 'LiamolesFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });

    table.grantReadWriteData(fn);

    // Seed the initial balance via a custom resource (runs once on deploy)
    const seedProvider = new cr.AwsCustomResource(this, 'SeedBalance', {
      onCreate: {
        service: 'DynamoDB',
        action: 'putItem',
        parameters: {
          TableName: table.tableName,
          Item: {
            pk: { S: 'balance' },
            amount: { N: '15' },
          },
          ConditionExpression: 'attribute_not_exists(pk)',
        },
        physicalResourceId: cr.PhysicalResourceId.of('SeedBalance'),
        ignoreErrorCodesMatching: 'ConditionalCheckFailedException',
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [table.tableArn],
      }),
    });
    seedProvider.node.addDependency(table);

    // API Gateway
    const api = new apigateway.RestApi(this, 'LiamolesApi', {
      restApiName: 'Liamoles API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type'],
      },
    });

    const integration = new apigateway.LambdaIntegration(fn);

    const liamoles = api.root.addResource('liamoles');
    liamoles.addMethod('GET', integration);   // fetch balance
    liamoles.addMethod('POST', integration);  // add or subtract

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Base URL for the Liamoles API',
    });
  }
}
