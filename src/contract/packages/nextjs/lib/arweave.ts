import { WebIrys } from "@irys/sdk";
import { BrowserProvider } from "ethers";

const getCDHJson = async (name: string, image: string) => {
  const nftMetadata = {
    name: `CDH ${name}`,
    description: "CDH NFT",
    image,
    attributes: [
      {
        trait_type: 0,
        value: image,
      },
    ],
  };

  const jsonString = JSON.stringify(nftMetadata, null, 2);
  return new Blob([jsonString], { type: "application/json" });
};

const getWebIrys = async () => {
  await window.ethereum.enable();
  const provider = new BrowserProvider(window.ethereum);

  const network = "devnet";
  const token = "ethereum";
  const providerUrl = "https://rpc.sepolia.dev";

  // Create a wallet object
  const wallet = { rpcUrl: providerUrl, name: "ethersv6", provider: provider };
  // Use the wallet object
  const webIrys = new WebIrys({ network, token, wallet });
  await webIrys.ready();

  return webIrys;
};

export const uploadMetadata = async (name: string, image: string): Promise<string> => {
  const irys = await getWebIrys();
  const metadataBlob = await getCDHJson(name, image);
  const metadataFile = new File([metadataBlob], `${name}.json`, {
    type: "application/json",
  });

  try {
    const response = await irys.uploadFile(metadataFile);
    console.log(`File uploaded ==> https://gateway.irys.xyz/mutable/${response.id}`);
    console.log(`response: ${JSON.stringify(response)}`);
    return `https://gateway.irys.xyz/mutable/${response.id}`;
  } catch (e) {
    console.log("Error uploading file ", e);
    return "";
  }
};

// export const updateImage = async (preResponse: { id: any }) => {
//   const irys = await getIrys();
//   const fileToUpload = "./images/light.png";

//   // Get size of file
//   const { size } = await fs.promises.stat(fileToUpload);
//   // Get cost to upload "size" bytes
//   const price = await irys.getPrice(size);
//   console.log(`Uploading ${size} bytes costs ${irys.utils.fromAtomic(price)} ${token}`);
//   // Fund the node
//   await irys.fund(price, 1.5);

//   // Upload metadata
//   try {
//     const tags = [{ name: "Root-TX", value: preResponse.id }];
//     const response = await irys.uploadFile(fileToUpload, { tags });
//     console.log(`File uploaded ==> https://gateway.irys.xyz/mutable/${preResponse.id}`);
//     console.log(`New File uploaded ==> https://gateway.irys.xyz/mutable/${response.id}`);
//     console.log(`response: ${JSON.stringify(response)}`);
//   } catch (e) {
//     console.log("Error uploading file ", e);
//   }
// };
