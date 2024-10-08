import { Duration } from 'aws-cdk-lib';
import {
  BaseDataSource,
  DynamoDbDataSource,
  GraphqlApiBase,
  HttpDataSource,
  LambdaDataSource,
  NoneDataSource,
  CfnResolver,
  CfnFunctionConfiguration,
  HttpDataSourceOptions,
} from 'aws-cdk-lib/aws-appsync';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IFunction, ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import {
  AppSyncFunctionConfigurationProvider,
  DataSourceOptions,
  SearchableDataSourceOptions,
  MappingTemplateProvider,
} from './graphql-api-provider';
import { VpcConfig } from './model-datasource';

export interface DynamoDbDataSourceOptions extends DataSourceOptions {
  /**
   * ServiceRole for the Amazon DynamoDb
   */
  readonly serviceRole: IRole;
}

export interface TransformHostProvider {
  setAPI(api: GraphqlApiBase): void;

  addHttpDataSource(name: string, endpoint: string, options?: HttpDataSourceOptions, scope?: Construct): HttpDataSource;
  addDynamoDbDataSource(name: string, table: ITable, options?: DynamoDbDataSourceOptions, scope?: Construct): DynamoDbDataSource;
  addNoneDataSource(name: string, options?: DataSourceOptions, scope?: Construct): NoneDataSource;
  addLambdaDataSource(name: string, lambdaFunction: IFunction, options?: DataSourceOptions, scope?: Construct): LambdaDataSource;
  addSearchableDataSource(
    name: string,
    endpoint: string,
    region: string,
    options?: SearchableDataSourceOptions,
    scope?: Construct,
  ): BaseDataSource;

  addAppSyncFunction: (
    name: string,
    requestMappingTemplate: MappingTemplateProvider,
    responseMappingTemplate: MappingTemplateProvider,
    dataSourceName: string,
    scope?: Construct,
    runtime?: CfnFunctionConfiguration.AppSyncRuntimeProperty,
  ) => AppSyncFunctionConfigurationProvider;

  addResolver: (
    typeName: string,
    fieldName: string,
    requestMappingTemplate: MappingTemplateProvider,
    responseMappingTemplate: MappingTemplateProvider,
    resolverLogicalId?: string,
    dataSourceName?: string,
    pipelineConfig?: string[],
    scope?: Construct,
    runtime?: CfnFunctionConfiguration.AppSyncRuntimeProperty,
  ) => CfnResolver;

  addLambdaFunction: (
    functionName: string,
    functionKey: string,
    handlerName: string,
    filePath: string,
    runtime: Runtime,
    layers?: ILayerVersion[],
    role?: IRole,
    environment?: { [key: string]: string },
    timeout?: Duration,
    scope?: Construct,
    vpc?: VpcConfig,
    description?: string,
  ) => IFunction;

  getDataSource: (name: string) => BaseDataSource | void;
  hasDataSource: (name: string) => boolean;

  getResolver: (typeName: string, fieldName: string) => CfnResolver | void;
  hasResolver: (typeName: string, fieldName: string) => boolean;
}
