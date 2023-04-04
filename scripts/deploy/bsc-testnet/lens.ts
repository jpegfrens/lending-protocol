import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Lens = await ethers.getContractFactory("CompoundLens");
  const lens = await Lens.deploy();
  await lens.deployed();

  console.log("Lens deployed to:", lens.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
