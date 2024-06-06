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
});
