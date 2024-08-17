# Central Data Hub (CDH)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

```bash
cd contract
yarn install
forge install
```

2. Compile

```bash
yarn compile
```

```bash
cd packages/hardhat
forge build
```

3. Test

```bash
forge test -vvvv
```

4. Run a local network in the first terminal:

```bash
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

5. On a second terminal, deploy the test contract:

```bash
yarn deploy
```

- Deploy NFT

```bash
yarn deploy --deploy-scripts 02_deploy_sample_contract.ts
```

1. On a third terminal, start your NextJS app:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

## Contract

| Contract Name |               Contract Address               | Explorer |
| :-----------: | :------------------------------------------: | :------: |
|    **CDH**    | `0xb56594536F08D747107C734376E3b908Ed3a02eD` | https://testnet.crossvaluescan.com/address/0xb56594536F08D747107C734376E3b908Ed3a02eD |
|    **ERC6551Account**    | `0xDFc02e7eD1A119ceDD91cA4ff030F01F450912a9` | https://testnet.crossvaluescan.com/address/0xDFc02e7eD1A119ceDD91cA4ff030F01F450912a9 |
|    **ERC6551Registry**    | `0xB25569E3F148941b0b07e4BfbF4Dca71BfBbb804` | https://testnet.crossvaluescan.com/address/0xB25569E3F148941b0b07e4BfbF4Dca71BfBbb804 |

## Sample Data

- Sample Image
- [https://res.cloudinary.com/dplp5wtzk/image/upload/v1715440386/token-monster/8.png](https://res.cloudinary.com/dplp5wtzk/image/upload/v1715440386/token-monster/8.png)
- Sample Metadata
- [https://res.cloudinary.com/dxqgqsi0r/raw/upload/v1723883455/metadata/sample](https://res.cloudinary.com/dxqgqsi0r/raw/upload/v1723883455/metadata/sample)
