import * as azure from '@pulumi/azure-native';

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

export const url = containerApp.configuration.apply((config) => config?.ingress?.fqdn);
