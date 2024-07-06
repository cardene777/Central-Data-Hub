# Metadata

## Overview

**DACS** is assumed as the storage location for metadata.
However, until it is released, it needs to be stored elsewhere.
Candidates are therefore **IPFS** and **Arweave**.
In the Xenea Whitepaper and documentation, I think I saw a statement that **IPFS** will be used until **DACS** is released.
Therefore, we were originally going to use **IPFS**, but now we are using **Arweave**, so we will explain this point.

## Features

While listing the respective features of **IPFS** and **Arweave**, we explain why we have adopted **Arweave** once this time.

### IPFS

**IPFS** allows data to be stored without incurring gas costs.
On the other hand, file names etc. are random, so each time the data is updated, a new path is used.
When the metadata associated with each `tokenId` is managed in a contract, the contract needs to be updated every time it is updated.
There was a JS library, but it is now deprecated.
There is a library called Helia, but it is not stable enough to work with the Next.js App Router.

- [https://github.com/ipfs/helia](https://github.com/ipfs/helia)


### Arweave

Arweave is a blockchain and therefore requires gas money to store data.
There are several tokens that pay to store data, including **Ethereum**, **Solana**, **Matic** and **Aptos**.
There are Gateway services such as Iris and others using Arweave, which allow you to fix the path and change the content inside (variable references).

- [Mutable references](https://docs.irys.xyz/developer-docs/mutable-references)

This allows content to be updated without updating the contract when the contract manages the metadata associated with each `tokenId`.

### Reasons for choosing Arweave

Arweave allows variable referencing (the content can be changed without changing the URL), which means that the content can be updated without updating the contract.
This costs a small amount of gas, but is considered sufficient as a bridge until the release of **DACS**.
There is also a variable referencing mechanism in **IPFS** called **MFS**, but this is not working well with the Next.js App Router and is under investigation.

## Consideration

The method we would most like to implement is updating data by direct access from the contract to **DACS**.
If **DACS** can be accessed directly from the contract, we will change the overall design depending on the implementation here, as we can control data update permissions in detail.
