# Chainnect - Generic Blockchain Client

Chainnect is designed as a standard javascript client interface for building applications that have to support multiple blockchains.

Think Ethereum's web3.js but with support for multiple blockchains and based on current best practices.

## Design Goals

The design goals are to support a minimal simplified and generic blockchain interface as well as separate out concerns cleanly.

Initially there will be a few major Interfaces:

- Blockchain
- Token
- Wallet
- Exchange

From a technical point of view, we want to focus on a combination of bundle size, lazy initialization and secure loading of individual implementations of the specific interfaces.

## Getting started

Chainnect monorepo uses yarn workspaces & lerna

Install root package dependencies

```
yarn install
```

Install all packages dependencies

```
yarn bootstrap
```

Run the tests

```
yarn test
```

```
yarn test:watch
```

