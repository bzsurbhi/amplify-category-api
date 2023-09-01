import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Template } from 'aws-cdk-lib/assertions';
import { AmplifyGraphqlApi } from '../../amplify-graphql-api';

/**
 * Utility to wrap construct creation a basic synth step to smoke test
 * @param buildApp callback to create the resources in the stack
 */
const verifySynth = (buildApp: (stack: cdk.Stack) => void): void => {
  const stack = new cdk.Stack();
  buildApp(stack);
  Template.fromStack(stack);
};

describe('predictions category', () => {
  it('synths with predictions config', () => {
    verifySynth((stack) => {
      new AmplifyGraphqlApi(stack, 'TestApi', {
        schema: /* GraphQL */ `
          type Query {
            recognizeTextFromImage: String @predictions(actions: [identifyText])
          }
        `,
        authorizationConfig: {
          apiKeyConfig: { expires: cdk.Duration.days(7) },
        },
        predictionsBucket: s3.Bucket.fromBucketName(stack, 'PredictionsBucket', 'predictions-bucket'),
      });
    });
  });

  it('generates a nested stack for predictions directive', () => {
    const stack = new cdk.Stack();
    const api = new AmplifyGraphqlApi(stack, 'TestApi', {
      schema: /* GraphQL */ `
        type Query {
          recognizeTextFromImage: String @predictions(actions: [identifyText])
        }
      `,
      authorizationConfig: {
        apiKeyConfig: { expires: cdk.Duration.days(7) },
      },
      predictionsBucket: new s3.Bucket(stack, 'PredictionsBucket'),
    });

    expect(api.resources.nestedStacks.PredictionsDirectiveStack).toBeDefined();
    const predictionsTemplate = Template.fromStack(api.resources.nestedStacks.PredictionsDirectiveStack);
    expect(predictionsTemplate).toBeDefined();
  });
});
