# Backnd Two

I'm updating my little backend workhorse [backnd](https://github.com/diope/backnd) that I use on projects to quickly get ideas hammered out (even if I eventually abandom them...). Because I've fallen in love with Typescript this presents a great opportunity to utilize it at the ground level. Also going to use GraphQL. I sticking to REST and I need to get comfortable and more knowledgeable with GraphQL because it's not going anywhere. Also I'm going to be using TypeORM and PostgreSQL for this project.

## Features to implement
* JWT Authentication/Authorization
* User table
* GraphQL endpoint
* React/Redux skeleton frontend

### Note:

If you stumble upon this repo and decide to use it for your own reasons. Open your `ormconfig.json` file and change the user to your postgres default user (if you have never configured your postgres install, the default user is 'postgres'). Then run `yarn upgrade-interactive --latest` just to make sure everything is up to date. Lastly run `yarn start` to make sure it can connect to the DB. Run `docker compose up` to create a postgres container

