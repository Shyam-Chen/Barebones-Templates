import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();

const appLabels = { app: 'node-app' };

const deployment = new k8s.apps.v1.Deployment('node-app-deployment', {
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [
          {
            name: 'node-app',
            image: config.get('node-app'),
            ports: [{ containerPort: 3000 }],
          },
        ],
      },
    },
  },
});

export const name = deployment.metadata.name;

const service = new k8s.core.v1.Service('node-app-service', {
  spec: {
    type: 'LoadBalancer',
    selector: appLabels,
    ports: [{ port: 80, targetPort: 3000 }],
  },
});

export const url = service.status.loadBalancer.ingress[0].hostname;
