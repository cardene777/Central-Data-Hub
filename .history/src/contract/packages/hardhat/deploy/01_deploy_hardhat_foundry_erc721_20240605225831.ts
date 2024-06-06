import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployCDHContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ERC6551Account", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const ercContract = await hre.ethers.getContract<Contract>("ERC6551Account", deployer);
  console.log("🚀 Deploy CDH Contract:", await cdhContract.getAddress());

  await deploy("CDH", {
    from: deployer,
    args: ["CDH NFT", "CDH"],
    log: true,
    autoMine: true,
  });

  const cdhContract = await hre.ethers.getContract<Contract>("CDH", deployer);
  console.log("🚀 Deploy CDH Contract:", await cdhContract.getAddress());
};

export default deployCDHContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployCDHContract.tags = ["HardhatFoundryERC721Contract"];
