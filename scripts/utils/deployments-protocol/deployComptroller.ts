import { ethers } from "hardhat";

export const deployComptroller = async () => {
  const Comptroller = await ethers.getContractFactory("Comptroller");
  const comptroller = await Comptroller.deploy();
  await comptroller.deployed();
  console.log("Comptroller deployed to:", comptroller.address);
  return comptroller;
};
