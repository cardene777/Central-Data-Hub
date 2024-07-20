import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployCDHContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // SampleERC721
  await deploy("SampleERC721", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const sampleERC721Contract = await hre.ethers.getContract<Contract>
    ("SampleERC721", deployer);
  const sampleERC721Address = await sampleERC721Contract.getAddress();
  console.log("🚀 Deploy SampleERC721 Contract:", sampleERC721Address);

  // SampleERC1155
  await deploy("SampleERC1155", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const sampleERC1155Contract = await hre.ethers.getContract<Contract>("SampleERC1155", deployer);
  const sampleERC1155Address = await sampleERC1155Contract.getAddress();
  console.log("🚀 Deploy SampleERC1155 Contract:", sampleERC1155Address);

  // SampleERC721 Mint
  await sampleERC721Contract.mint(deployer);
  console.log("💫 Mint SampleERC721 NFT");

  // SampleERC1155 Mint
  await sampleERC1155Contract.mint(deployer, 0, 1000);
  console.log("💫 Mint SampleERC1155 NFT");
};

export default deployCDHContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CDH
deployCDHContract.tags = ["CDH"];
