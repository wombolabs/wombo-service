# wombo-service

# CockroachDB

First, we need to create `.env` file with `COCKROACHDB_DATABASE_URL` variable

# Prisma

## Generate Client

```
npx prisma generate
```

![prisma_generate_schema](https://res.cloudinary.com/prismaio/image/upload/v1628761155/docs/FensWfo.png)

## Migrate

```
npx prisma migrate dev
```

## Seed

```
npx prisma db seed
```

# Serverless

## Local deployment

```
npm run deploy:offline
```

## Test deployment

```
npm run deploy:test
```
