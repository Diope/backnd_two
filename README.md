# Backnd Two

A sequel to my little backend workhorse [backnd](https://github.com/diope/backnd) that I use on projects to quickly get ideas hammered out (even if I eventually abandom them...). Because I've become a huge fan of Typescript this presents a great opportunity to utilize it at the ground level. This project will use GraphQL for data API endpoints, as it's what I've been using lately and prefer it over REST because you neither overfetch or underfetch data, and you get exactly what you are requesting.

## Technology Stack
* Node.js
* Express
* GraphQL
* Postgresql
* TypeORM
* TypeGraphQL
* Apollo
* Docker

* React

## Getting Started:

Make sure you have the following installed:
* Docker

Within the server/ directory first run `npm install`/`yarn install` then run `docker-compose up -d` to get the database up and running. Please refer to the `ormconfig.json` to make sure it matches with docker-compose fields. Once this is done you will be able to run `yarn start`.

GraphQL is located at `http://localhost:4000/graphql`

### Note 2: 
I use a Postgresql extension `pgcrypto` to have postgres accept uuid field. This will be used for querying purposes in lieu of the index. I think it's a smart idea to use uuid (or Eric Elliot's `cuid`) as a small precaution for a couple reasons. 
1. Not running out of indices, chances are really high you will never reach this point, but hey who knows.
2. Might be slightly paranoid on my end but it helps against people being able to take a guess at the shape of your data and it's associated users in URLs due to the id param.

