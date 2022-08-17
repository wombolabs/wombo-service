# wombo-api-service

<a href="https://github.com/wombolabs/wombo-service/releases/latest" target="_blank"><img alt="GitHub release" src="https://img.shields.io/github/v/release/wombolabs/wombo-service"></a>

# CockroachDB

# Prisma

## Generate Client

```
npm run prisma:client
```

![prisma_generate_schema](https://res.cloudinary.com/prismaio/image/upload/v1628761155/docs/FensWfo.png)

## Migrate

```
npm run migrate:dev
```

## Seed

```
npm run prisma:seed
```

# Serverless

## Local deployment

First of all, create Prisma client without data-proxy

```
npm run prisma:client
```

and then

```
npm run deploy:offline
```

Note: check `.env.local`

## Test deployment

```
npm run deploy:test
```

Note: check `.env.test`

# Contributors

<table>
   <tr>
      <td align="center"><img src="https://avatars.githubusercontent.com/u/17725525?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Mastroviti</b></sub><br />
         <a href="https://github.com/wombolabs/wombo-service/commits?author=nmastroviti" title="Code">💻</a> <a href="https://www.notion.so/Board-Current-Sprint-cd65d107c1a643dca095be683a5062fd" title="Project Management">📆</a>
      </td>
   </tr>
</table>
