import * as azure from '@pulumi/azure-native';
import * as pulumi from '@pulumi/pulumi';

test('should create a container app with the correct configuration and URL', async () => {
  const stack = await pulumi.runtime.runInPulumiStack(async () => {
    const resourceGroup = new azure.resources.ResourceGroup('myResourceGroup');

    const containerAppEnv = new azure.app.ManagedEnvironment('myContainerAppEnv', {
      resourceGroupName: resourceGroup.name,
    });

    const containerApp = new azure.app.ContainerApp('myContainerApp', {
      resourceGroupName: resourceGroup.name,
      managedEnvironmentId: containerAppEnv.id,
      configuration: {
        ingress: {
          external: true,
          targetPort: 80,
        },
      },
      template: {
        containers: [
          {
            name: 'myfrontendcontainer',
            image: 'vue-starter',
            resources: {
              cpu: 0.5,
              memory: '250Mb',
            },
          },
        ],
      },
    });

    return {
      resourceGroupName: resourceGroup.name,
      containerAppName: containerApp.name,
      containerAppUrl: containerApp.configuration.apply((config) => config?.ingress?.fqdn),
    };
  });

  expect(stack.resourceGroupName).toBe('myResourceGroup');
  expect(stack.containerAppName).toBe('myContainerApp');
  expect(stack.containerAppUrl).toBeDefined();
});
