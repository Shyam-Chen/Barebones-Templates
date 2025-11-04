# _PROJECT_NAME_

## Prerequisites

- Node.js v24
- PNPM v10
- Docker v28
- Pulumi v3
- Kubernetes v1
- Helm v3

## Usage

```sh
$ pnpm install
```

```sh
# development
$ pulumi stack select dev

# testing
$ pulumi stack select sit

# staging
$ pulumi stack select uat

# production
$ pulumi stack select prod
```

```sh
$ pulumi up
```

```sh
$ pnpm lint
```

```sh
$ pnpm check
```

```sh
$ pnpm test
```
