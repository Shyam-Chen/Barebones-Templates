# _PROJECT_NAME_

## Prerequisites

- Node.js v22
- PNPM v9
- Docker v4
- Pulumi v3
- Azure v2

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
