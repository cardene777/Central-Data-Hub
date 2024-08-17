import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployCDHContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const baseUri = "https://res.cloudinary.com/dplp5wtzk/image/upload/v1715440386/token-monster/";

  // SampleERC721 #1
  await deploy("SampleERC721", {
    from: deployer,
    args: [deployer, "Sample ERC721 X1X", "C721X1", baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC721Contract_1 = await hre.ethers.getContract<Contract>("SampleERC721", deployer);
  const sampleERC721Address_1 = await sampleERC721Contract_1.getAddress();
  console.log("🚀 Deploy SampleERC721 Contract:", sampleERC721Address_1);

  // SampleERC721 #2
  await deploy("SampleERC721", {
    from: deployer,
    args: [deployer, "Sample ERC721 X2X", "C721X2", baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC721Contract_2 = await hre.ethers.getContract<Contract>("SampleERC721", deployer);
  const sampleERC721Address_2 = await sampleERC721Contract_2.getAddress();
  console.log("🚀 Deploy SampleERC721 Contract:", sampleERC721Address_2);

  // SampleERC721 #3
  await deploy("SampleERC721", {
    from: deployer,
    args: [deployer, "Sample ERC721 X3X", "C721X3", baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC721Contract_3 = await hre.ethers.getContract<Contract>("SampleERC721", deployer);
  const sampleERC721Address_3 = await sampleERC721Contract_3.getAddress();
  console.log("🚀 Deploy SampleERC721 Contract:", sampleERC721Address_3);

  // SampleERC1155 #1
  await deploy("SampleERC1155", {
    from: deployer,
    args: [deployer, baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC1155Contract_1 = await hre.ethers.getContract<Contract>("SampleERC1155", deployer);
  const sampleERC1155Address_1 = await sampleERC1155Contract_1.getAddress();
  console.log("🚀 Deploy SampleERC1155 Contract:", sampleERC1155Address_1);

  // SampleERC1155 #2
  await deploy("SampleERC1155", {
    from: deployer,
    args: [deployer, baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC1155Contract_2 = await hre.ethers.getContract<Contract>("SampleERC1155", deployer);
  const sampleERC1155Address_2 = await sampleERC1155Contract_2.getAddress();
  console.log("🚀 Deploy SampleERC1155 Contract:", sampleERC1155Address_2);

  // SampleERC1155 #3
  await deploy("SampleERC1155", {
    from: deployer,
    args: [deployer, baseUri],
    log: true,
    autoMine: true,
  });

  const sampleERC1155Contract_3 = await hre.ethers.getContract<Contract>("SampleERC1155", deployer);
  const sampleERC1155Address_3 = await sampleERC1155Contract_3.getAddress();
  console.log("🚀 Deploy SampleERC1155 Contract:", sampleERC1155Address_3);

  // SampleERC20 #1
  await deploy("SampleERC20", {
    from: deployer,
    args: [deployer, "Sample ERC20 X1X", "C20X1"],
    log: true,
    autoMine: true,
  });

  const sampleERC20Contract_1 = await hre.ethers.getContract<Contract>("SampleERC20", deployer);
  const sampleERC20Address_1 = await sampleERC20Contract_1.getAddress();
  console.log("🚀 Deploy SampleERC20 Contract:", sampleERC20Address_1);

  // SampleERC20 #2
  await deploy("SampleERC20", {
    from: deployer,
    args: [deployer, "Sample ERC20 X2X", "C20X2"],
    log: true,
    autoMine: true,
  });

  const sampleERC20Contract_2 = await hre.ethers.getContract<Contract>("SampleERC20", deployer);
  const sampleERC20Address_2 = await sampleERC20Contract_2.getAddress();
  console.log("🚀 Deploy SampleERC20 Contract:", sampleERC20Address_2);

  // SampleERC20 #3
  await deploy("SampleERC20", {
    from: deployer,
    args: [deployer, "Sample ERC20 X3X", "C20X3"],
    log: true,
    autoMine: true,
  });

  const sampleERC20Contract_3 = await hre.ethers.getContract<Contract>("SampleERC20", deployer);
  const sampleERC20Address_3 = await sampleERC20Contract_3.getAddress();
  console.log("🚀 Deploy SampleERC20 Contract:", sampleERC20Address_3);

  // SampleERC721 Mint
  await sampleERC721Contract_1.mint(deployer);
  console.log("💫 Mint SampleERC721 NFT X1X");
  await sampleERC721Contract_2.mint(deployer);
  console.log("💫 Mint SampleERC721 NFT X2X");
  await sampleERC721Contract_3.mint(deployer);
  console.log("💫 Mint SampleERC721 NFT X3X");

  // SampleERC1155 Mint
  await sampleERC1155Contract_1.mint(deployer, 0, 10);
  console.log("💫 Mint SampleERC1155 NFT X1X");
  await sampleERC1155Contract_2.mint(deployer, 0, 5);
  console.log("💫 Mint SampleERC1155 NFT X2X");
  await sampleERC1155Contract_3.mint(deployer, 0, 8);
  console.log("💫 Mint SampleERC1155 NFT X3X");

  // SampleERC20
  await sampleERC20Contract_1.mint(deployer, 100);
  console.log("💫 Mint SampleERC20 X1X");
  await sampleERC20Contract_2.mint(deployer, 150);
  console.log("💫 Mint SampleERC20 X2X");
  await sampleERC20Contract_3.mint(deployer, 200);
  console.log("💫 Mint SampleERC20 X3X");
};

export default deployCDHContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CDH
deployCDHContract.tags = ["CDH_Sample_Contract"];
