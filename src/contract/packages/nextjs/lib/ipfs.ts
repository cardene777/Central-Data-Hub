// https://helia.io/
// https://github.com/ipfs/helia
// https://docs.ipfs.tech/concepts/file-systems/#mutable-file-system-mfs
// https://github.com/ipfs/helia/tree/main/packages/mfs
import { mfs } from "@helia/mfs";
import { createHelia } from "helia";

const getCDHJson = async (tokenId: number, image: string) => {
  const nftMetadata = {
    name: `CDH #${tokenId}`,
    description: "CDH NFT",
    image,
    attributes: [
      {
        trait_type: 0,
        value: "https://ipfs.com/",
      },
    ],
  };

  const jsonString = JSON.stringify(nftMetadata, null, 2);
  return new TextEncoder().encode(jsonString);
};

export const addIpfs = async (dir: string, tokenId: number, image: string) => {
  const helia = await createHelia();
  const m = mfs(helia);

  try {
    const files = m.ls(dir);
    console.log(`files: ${files}`);
  } catch (err) {
    await m.mkdir(dir);
  }
  const cdhJson = await getCDHJson(tokenId, image);
  await m.writeBytes(cdhJson, dir);
};
