# Marvel API

Web-based API for `Marvel API`. See https://developer.marvel.com/

Only contains `Characters` Service.

Used my own boilerplate code for building this API. See [agaphetos/node-service-api-boilerplate](https://github.com/agaphetos/node-service-api-boilerplate).

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Caching](#caching)
- [Credits](#credits)
- [Author](#author)

## Requirements

- [Node.js v10+](https://nodejs.org/) - `Runtime`
- [Redis](http://redis.io/) - Used for `Caching`

## Getting Started

Note: `Redis` must be installed and running on your local machine.

1. Clone the repository.

```sh
$ git clone https://github.com/agaphetos/marvel-api.git
```

2. Install dependencies.

```sh
$ npm install
```

3. Create `.env` from `.env.example`.

```sh
$ cp .env.example .env
```

4. Set the `ENVIRONMENT VARIABLES` needed by the application.

```sh
# MARVEL API CONFIGURATION
MARVEL_API_BASE_URL=
MARVEL_API_VERSION=
MARVEL_API_PUBLIC_KEY=
MARVEL_API_PRIVATE_KEY=

# REDIS CONFIGURATION
REDIS_HOST=
REDIS_PORT=
REDIS_ABSOLUTE_EXPIRY=

```

5. Run the application.

- for `Production` mode:

```sh
$ npm start
```

or

- for `Development` mode:

```sh
$ npm run dev
```

Note: Application will be running on Port `8080` by default. Can be also configured by setting `PORT` on your environment variables.

## API Documentation

API Documentation is built using [Swagger](https://swagger.io/specification/) and follows [OpenAPI Specification v3](https://swagger.io/specification/).

It can be also viewed on the `/api/v1/docs` route on the application instance once running.

- https://localhost:8080/api/v1/docs

## Caching

### Caching Strategy

For the `Caching Strategy`, we used `Cache Aside`.

This strategy will first request the data from the cache. 

If the data exists, the app will retrieve the data directly.

If not, the app will request data from the data source and write it to the cache so that the data can be retrieved from the cache again next time.

### Data Cache Expiry and Eviction

We used both `Absolute Expiration` and `Auto Evict Policy` in this application.

`Absolute Expiration` means that our data will reside on our `Cache Store` for an absolute amount of time. This was used for the caching `list based` requests to `Marvel API` on `GET /characters` API. 

We also used their recommendation to cache our data for 24 hours. See https://developer.marvel.com/documentation/attribution.

`Auto Evict Policy` means that our data will reside on our `Cache Store` with indefinite amount of time based and automatically extends the most frequent data accessed. While evicting the least accessed data. This enables us to utilize the `RAM/Memory` of our `machine/server` efficiently. `Redis` automatically does this.

This was also used for caching the `resource based` requests to `Marvel API` on `GET /characters/{characterId}`.

## Credits

- [Talysson De Oliveira](https://github.com/talyssonoc) - `node-api-boilerplate`
- [Marvel](https://marvel.com) - Data provided by Marvel. © 2020 MARVEL

## Author

Levin Calado <levincalado@gmail.com>