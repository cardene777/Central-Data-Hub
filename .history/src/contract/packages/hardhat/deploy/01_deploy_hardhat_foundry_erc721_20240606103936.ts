import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployCDHContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // ERC6551Account
  await deploy("ERC6551Account", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const erc6551AccountContract = await hre.ethers.getContract<Contract>
    ("ERC6551Account", deployer);
  const erc6551AccountAddress = await erc6551AccountContract.getAddress();
  console.log("🚀 Deploy ERC6551Account Contract:", erc6551AccountAddress);

  // ERC6551Registry
  await deploy("ERC6551Registry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const erc6551RegistryContract = await hre.ethers.getContract<Contract>("ERC6551Registry", deployer);
  const erc6551RegistryAddress = await erc6551RegistryContract.getAddress();
  console.log("🚀 Deploy ERC6551Registry Contract:", erc6551RegistryAddress);

  // CDH
  await deploy("CDH", {
    from: deployer,
    args: ["CDH NFT", "CDH", erc6551RegistryAddress, erc6551AccountAddress],
    log: true,
    autoMine: true,
  });

  const cdhContract = await hre.ethers.getContract<Contract>("CDH", deployer);
  console.log("🚀 Deploy CDH Contract:", await cdhContract.getAddress());

  await cdhContract.safeMint(
    deployer,
    "https://res.cloudinary.com/dplp5wtzk/image/upload/v1715440386/token-monster/8.png",
  );
  console.log("💫 Mint CDH NFT:", await cdhContract.getAddress());
};

export default deployCDHContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CDH
deployCDHContract.tags = ["CDH"];
