# Context Verifier

## Install

```bash
npm install
```

## Set the environment vars

Create a .env file in the project folder.

Set your polygon URL provider:

POLYGON_PROVIDER=

Example:
```
POLYGON_PROVIDER=https://polygon-mainnet.g.alchemy.com/v2/aaabbbccc
``

## Execute verifier

```bash
npx ts-node start.ts {name}
```

Example: 

```bash
npx ts-node start.ts context
```