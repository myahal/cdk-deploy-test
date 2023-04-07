import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { resolve } from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'fn1', {
      handler: 'src/lambda.handler',
      runtime: Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      code:Code.fromAsset(resolve(__dirname, '../../lambda'), {
        assetHashType: cdk.AssetHashType.OUTPUT,
        bundling: {
          image: Runtime.NODEJS_18_X.bundlingImage,
          command: [
            'bash',
            '-c',
            [
              'npm install -sg typescript', 
              'npm install -sg yarn',
              'cp -r yarn.lock package.json tsconfig.json src  /tmp',
              'cd /tmp',
              'yarn add silent --force',
              'yarn tsc --outDir /asset-output',
              'cp -r node_modules /asset-output'
            ].join('&&')
          ],
          user: 'root'
        },
      })
    })


    const restApi = new apigw.RestApi(this, 'lambda-restApi', {
      endpointTypes: [apigw.EndpointType.REGIONAL]
    })
    restApi.root.addProxy({
      anyMethod: true,
      defaultIntegration: new apigw.LambdaIntegration(lambda)
    })

    new cdk.CfnOutput(this, 'API Endpoint', {value: restApi.url})

  }
}
