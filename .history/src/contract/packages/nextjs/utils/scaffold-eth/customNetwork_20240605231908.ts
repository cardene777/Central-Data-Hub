import { defineChain } from "viem";


export const zora = defineChain({
  id: 5555,
  name: "CVC Kura",
  nativeCurrency: {
    decimals: 18,
    name: "CVC Kura",
    symbol: "XCR",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-kura.cross.technology/"],
      webSocket: [],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.crossvaluescan.com/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 5882,
    },
  },
});
