# Books API V2
This project uses the following technology

- __express__ for routing
- __sequelize__ as ORM
- __mocha__ for testing

## Running in Development
Before running in development make sure you follow the steps in database setup.

`npm run start` to start the server

`npm test` to run the tests

## Database Setup
You need Postgres running. I recommend [Postgres.app](https://postgresapp.com/)

`createuser daniel -P`
Then enter password `daniel`

Then do 
`createdb daniel`

If you want to reset the database do
`dropdb daniel`

Then redo
`createdb daniel`