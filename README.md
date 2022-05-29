# Abacus 🧮

## What is this?

Abacus is a full-stack personal finance application backed by PostgreSQL, Prisma, Node/Express, TypeScript and React.  
It uses [Vite](https://vitejs.dev/) for lightning-fast local development.

## How can I run this?

This repository is set up as a [Turborepo](https://turborepo.org/docs) monorepo.

### Install dependencies

To install dependencies, run `npm install` at the project root.

### Add Environment Variables

Add the following values to a `.env` file in each package root.

### Client

`VITE_SERVER_HOST`: The URI + port for the backend server.

### Server

`DATABASE_URL`: The database connection URL (postgreSQL).  
`JWT_SECRET`: JWT secret key.  
`PLAID_CLIENT_ID`: Client id for [Plaid](https://plaid.com/).  
`PLAID_SECRET_SANDBOX`: Secret for Plaid sandbox environment.  
`PLAID_SECRET_DEVELOPMENT`: Secret for Plaid development environment.  
`PLAID_ENV`: Currently either `sandbox` or `development`.  
`NODE_ENV`: `development` or `production`.  
`PORT`: Port for express server to listen on.  

### Run packages

To run all packages from a single shell, run `npm run turbo:dev`.

To run packages individually, run `npm run dev` from the root of the package. (i.e. `/packages/server` for the `server` package)
