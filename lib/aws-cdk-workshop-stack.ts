import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import {Hitcounter} from "./hitcounter";
import {TableViewer} from "cdk-dynamo-table-viewer";

export class AwsCdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //define new AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler:'hello.handler'
    });

    const helloWithCounter = new Hitcounter(this, 'HelloHitCounter',{
      downstream:hello,
    });

    const apigateway = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    })

    new TableViewer(this, 'ViewHitCounter', {
      title:'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits'
    })
  }
}
