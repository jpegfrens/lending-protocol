import { ethers } from "hardhat";

export const deployUnitroller = async () => {
    const Unitroller = await ethers.getContractFactory("Unitroller");
    const unitroller = await Unitroller.deploy();
    await unitroller.deployed();
    console.log("Unitroller deployed to:", unitroller.address);
    return unitroller;
  };
  