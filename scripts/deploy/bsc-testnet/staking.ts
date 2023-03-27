import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const StakedDistributor = await ethers.getContractFactory(
    "StakedDistributor"
  );

  if (!process.env.PROTOCOL_TOKEN) {
    throw new Error("PROTOCOL_TOKEN must be set");
  }

  const stakedDistributor = await StakedDistributor.deploy(
    process.env.PROTOCOL_TOKEN,
    "stLending",
    "STL"
  );

  await stakedDistributor.deployed();

  console.log("StakedDistributor deployed to:", stakedDistributor.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
