import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const ProtocolToken = await ethers.getContractFactory("ProtocolToken");
  const protocolToken = await ProtocolToken.deploy(deployer.address);
  await protocolToken.deployed();
  console.log("ProtocolToken deployed to:", protocolToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
