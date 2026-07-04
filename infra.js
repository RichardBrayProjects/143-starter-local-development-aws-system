import { App, CfnOutput, Duration, RemovalPolicy, SecretValue, Stack } from "aws-cdk-lib";
import { Port, SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { AuroraPostgresEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from "aws-cdk-lib/aws-rds";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

class StarterSystemStack extends Stack {
  constructor(scope, id) {
    super(scope, id, { env: { region: "eu-west-2" } });

    const password = process.env.STARTER_DB_PASSWORD || "Starter12345!";
    const vpc = new Vpc(this, "Vpc", { maxAzs: 2, natGateways: 0, subnetConfiguration: [{ name: "private", subnetType: SubnetType.PRIVATE_ISOLATED }] });
    const lambdaSg = new SecurityGroup(this, "LambdaSg", { vpc });
    const dbSg = new SecurityGroup(this, "DatabaseSg", { vpc });
    dbSg.addIngressRule(lambdaSg, Port.tcp(5432));

    const database = new DatabaseCluster(this, "AuroraDatabase", {
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSg],
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_17_4 }),
      credentials: Credentials.fromPassword("postgres", SecretValue.unsafePlainText(password)),
      writer: ClusterInstance.serverlessV2("writer", { enablePerformanceInsights: false }),
      serverlessV2MinCapacity: 0,
      serverlessV2MaxCapacity: 1,
      serverlessV2AutoPauseDuration: Duration.seconds(300),
      defaultDatabaseName: "starter",
      backup: { retention: Duration.days(1) },
      deletionProtection: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const fn = new NodejsFunction(this, "WebAndApi", {
      entry: "server.js",
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(30),
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      securityGroups: [lambdaSg],
      bundling: {
        nodeModules: ["express", "pg", "serverless-http"],
        commandHooks: { beforeBundling: () => [], beforeInstall: () => [], afterBundling: (inDir, outDir) => [`cp -r ${inDir}/dist ${outDir}/dist`] },
      },
      environment: {
        DB_HOST: database.clusterEndpoint.hostname,
        DB_NAME: "starter",
        DB_USER: "postgres",
        DB_PASSWORD: password,
        DB_SSL: "true",
      },
    });

    const api = new HttpApi(this, "HttpApi");
    const integration = new HttpLambdaIntegration("Integration", fn);
    api.addRoutes({ path: "/", methods: [HttpMethod.ANY], integration });
    api.addRoutes({ path: "/{proxy+}", methods: [HttpMethod.ANY], integration });
    new CfnOutput(this, "Url", { value: api.apiEndpoint });
  }
}

new StarterSystemStack(new App(), "starter-system");
