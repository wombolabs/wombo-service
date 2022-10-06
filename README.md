<div align='center'>
  <img width="30%" src="https://www.datocms-assets.com/66310/1650468917-img_main_logo.svg" />
</div>

# wombo-api-service

# Prisma with CockroachDB

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
